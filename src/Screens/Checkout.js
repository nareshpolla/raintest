import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  StatusBar,
  Platform,
  TouchableOpacity,
  I18nManager,
  TextInput,
  DeviceEventEmitter,
  Keyboard,
  Image,
  BackHandler,
} from "react-native";
import { HeaderBackButton } from "react-navigation";
import Icon from "react-native-vector-icons/Ionicons";
import { colors } from "../themes/colors";
import Picker from "react-native-picker";

/**
 * Constant containing device's window height
 */
const windowHeight = Dimensions.get("window").height;
const IS_ANDROID = Platform.OS === "android";
/**
 * A function created for obtaining months value in desired order ex: 01,02,03,...12
 */
const getMonths = () => {
  let months = [];
  for (let i = 1; i < 13; i++) {
    let monthItem;
    if (i < 10) {
      monthItem = `0${i}`;
    } else {
      monthItem = `${i}`;
    }
    months.push(monthItem);
  }
  return months;
};

const getYears = (i = 0, totalYears = 15) => {
  let years = [];

  for (i; i <= totalYears; i++) {
    let yearValue = new Date().getFullYear() + i;
    let yearItem = yearValue;
    years.push(yearItem);
  }
  return years;
};

const getCurrentMonth = () => {
  let currentMonth = new Date().getMonth() + 1; //Current Month
  if (currentMonth < 10) {
    currentMonth = `0${currentMonth}`;
  }
  return currentMonth;
};

const getCurrentYear = () => {
  let currentYear = new Date().getFullYear();
  return currentYear;
};

export default class Checkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardNumber: "",
      cvvNumber: "",
      cardExpiryDate: "",
      cardNumberMaxLength: 19,
      isExpiryDateValid: false,
      isCardNumberValid: false,
      showCancelCardNumber: false,
      isMasterCard: false,
      isVisaCard: false,
      isMadaCard: false,
      isAmexCard: false,
      isDinersCard: false,
      isSaveCardFuture: false,
      areAllCardDetailsValid: false,
    };
    //To track if backspace was tapped for Card Number Input
    this.isCardNumberBackSpaceTapped = false;
  }
  componentWillMount() {
    const { navigation } = this.props;

    const articleDetails = navigation.getParam("selectedData", "");

    this.setState = {
      title: "Article Details",
    };
  }

  setCVVNumberInputViewStyle() {
    let cvvLength = this.state.isAmexCard ? 4 : 3;
    if (
      this.state.cvvNumber.length === 0 ||
      this.state.cvvNumber.length === cvvLength
    ) {
      return styles.cardNumberInputViewStyle;
    } else {
      return { ...styles.cardNumberInputViewStyle, borderColor: colors.red };
    }
  }

  setCVVNumberTextStyle() {
    let cvvLength = this.state.isAmexCard ? 4 : 3;
    if (
      this.state.cvvNumber.length === 0 ||
      this.state.cvvNumber.length === cvvLength
    ) {
      //black
      return styles.cvvNumberTextInputStyle;
    } else {
      // red
      return { ...styles.cvvNumberTextInputStyle, color: colors.red };
    }
  }

  setCardNumberInputViewStyle() {
    if (this.state.cardNumber.length > 0 && this.state.isCardNumberValid) {
      return styles.cardNumberInputViewStyle;
    } else if (
      this.state.cardNumber.length > 0 &&
      this.state.isCardNumberValid === false
    ) {
      return { ...styles.cardNumberInputViewStyle, borderColor: colors.red };
    } else {
      return styles.cardNumberInputViewStyle;
    }
  }
  setCardNumberTextStyle() {
    if (this.state.cardNumber.length > 0 && this.state.isCardNumberValid) {
      return styles.cardNumberTextInputStyle;
    } else if (
      this.state.cardNumber.length > 0 &&
      this.state.isCardNumberValid === false
    ) {
      return { ...styles.cardNumberTextInputStyle, color: colors.red };
    } else {
      return styles.cardNumberTextInputStyle;
    }
  }

  paymentTextInputFocus = () => {
    if (Picker !== undefined && Picker.isPickerShow) {
      Picker.hide();
    }

    //Emit trigger for onPaymentFocus
    DeviceEventEmitter.emit(paymentEventEmitters.PaymentOnFocus);
  };

  creditCardTextChange = (text) => {
    let formattedText = text && text.split(" ").join("");

    // Get card type from credit/debit  card number
    let cardType = getCreditDebitCardBrand(formattedText);

    if (formattedText.length > 0) {
      // formattedText = formattedText.match(new RegExp('.{1,4}', 'g')).join(' ');

      if (cardType === "amex") {
        // amex
        formattedText = formattedText
          .replace(/(\d{4})/, "$1 ")
          .replace(/(\d{4}) (\d{6})/, "$1 $2 ")
          .trim();
      } else if (cardType === "diners") {
        // diner's club, 14 digits
        formattedText = formattedText
          .replace(/(\d{4})/, "$1 ")
          .replace(/(\d{4}) (\d{6})/, "$1 $2 ")
          .trim();
      } else {
        // regular cc number, 16 digits
        formattedText = formattedText
          .replace(/(\d{4})/, "$1 ")
          .replace(/(\d{4}) (\d{4})/, "$1 $2 ")
          .replace(/(\d{4}) (\d{4}) (\d{4})/, "$1 $2 $3 ")
          .trim();
      }

      this.setState({ cardNumber: formattedText, showCancelCardNumber: true });
    } else {
      this.setState({ cardNumber: formattedText, showCancelCardNumber: false });
    }

    if (
      this.availableCardTypes.includes("mada") ||
      this.availableCardTypes.includes("MADA")
    ) {
      const isCardMada = isMadaCard(formattedText);
      if (isCardMada === true) {
        cardType = "mada";
      }
    }

    if (
      this.selectedPaymentType === "cards" &&
      !this.availableCardTypes.includes(cardType)
    ) {
      cardType = "";
    }

    this.setHighlightedCardtype(cardType);

    // Validate a credit card number
    let isValidNumber = valid_credit_card(formattedText);

    let cardMaxNumberWithSpaces = 19;

    if (
      (this.availableCardTypes.includes("amex") ||
        this.availableCardTypes.includes("AMERICAN EXPRESS")) &&
      cardType === "amex"
    ) {
      // Amex Card number have 15 digits
      cardMaxNumberWithSpaces = 17; //with spaces
      this.setState({
        cardNumberMaxLength: 17,
      });
    } else if (
      (this.availableCardTypes.includes("diners") ||
        this.availableCardTypes.includes("Diners Club International")) &&
      cardType === "diners"
    ) {
      // Diners Card number have 14 digits
      cardMaxNumberWithSpaces = 16; //with spaces
      this.setState({
        cardNumberMaxLength: 16,
      });
    } else {
      this.setState({
        cardNumberMaxLength: 19,
      });
    }

    // Total card numbers with spaces
    if (
      formattedText.length === cardMaxNumberWithSpaces
      //this.availableCardTypes.includes(cardType)
    ) {
      // true or false
      this.setState({ isCardNumberValid: isValidNumber });
    } else {
      // Always false
      this.setState({ isCardNumberValid: false });
    }
  };

  handleSelectionChange = (event) => {
    let currentCursorPos = event.nativeEvent.selection.start;
    if (
      (currentCursorPos === 4 ||
        currentCursorPos === 9 ||
        currentCursorPos === 14) &&
      this.isCardNumberBackSpaceTapped === true
    ) {
      if (IS_ANDROID) {
        if (this.state.cardNumber.length >= currentCursorPos.length) {
          // Change cursor position before space
          this.cardNumTxtInputRef.setNativeProps({
            selection: {
              start: currentCursorPos,
              end: currentCursorPos,
            },
          });
        }
      } else {
        // Change cursor position before space
        this.cardNumTxtInputRef.setNativeProps({
          selection: {
            start: currentCursorPos,
            end: currentCursorPos,
          },
        });
      }
    }
  };

  renderCancelIconForCardNumber() {
    if (this.state.cardNumber.length > 0 && this.state.showCancelCardNumber) {
      if (this.state.isCardNumberValid) {
        return (
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.cardNumberCancelViewStyle}
            onPress={this.clearCardNumberTextInput}
          >
            <CancelErrorIconBlack />
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.cardNumberCancelViewStyle}
            onPress={this.clearCardNumberTextInput}
          >
            <CancelErrorIconRed />
          </TouchableOpacity>
        );
      }
    } else {
      return null;
    }
  }

  renderCardNumberError() {
    if (
      this.state.cardNumber.length > 0 &&
      this.state.isCardNumberValid === false
    ) {
      return (
        <Text allowFontScaling={false} style={styles.cardNumberError}>
          {"Invalid card number"}
        </Text>
      );
    } else {
      return null;
    }
  }

  selectExpiryDate = () => {
    Keyboard.dismiss();

    let months = getMonths();
    let years = getYears();

    let pickerData = [months, years];
    let selectedValue = [getCurrentMonth(), getCurrentYear()];

    Picker.init({
      accessibilityLabel: "ExpiryDatePicker",
      pickerTitleText: "Select Expiry Date",
      pickerCancelBtnText: "Cancel",
      pickerConfirmBtnText: "Confirm",
      pickerData: pickerData,
      //pickerFontSize: 20,
      pickerToolBarFontSize: 14,
      pickerFontFamily: fonts.hmSansRegular,
      selectedValue: selectedValue,
      onPickerConfirm: (data) => {
        let selectedMonth = data[0];
        let selectedYear = data[1];
        let expiryDate = selectedMonth + "/" + selectedYear;
        let checkExpiryDateValid = this.checkForValidExpiryDate(
          selectedMonth,
          selectedYear
        );
        this.setState({
          cardExpiryDate: expiryDate,
          isExpiryDateValid: checkExpiryDateValid,
        });
        this.checkForOverALLCardValidations();
      },
      onPickerCancel: (data) => {},
      onPickerSelect: (data) => {},
    });
    Picker.show();
  };

  setExpiryDateInputViewStyle() {
    if (
      this.state.cardExpiryDate.length > 0 &&
      this.state.isExpiryDateValid === false
    ) {
      // red
      return { ...styles.expiryDateInputViewStyle, borderColor: colors.red };
    } else {
      // black
      return styles.expiryDateInputViewStyle;
    }
  }

  setExpiryDateTextStyle() {
    if (
      this.state.cardExpiryDate.length > 0 &&
      this.state.isExpiryDateValid === false
    ) {
      // red
      return { ...styles.expiryDateTextStyle, color: colors.red };
    } else {
      // black
      return styles.expiryDateTextStyle;
    }
  }

  renderExpiryDateError() {
    if (
      this.state.cardExpiryDate.length > 0 &&
      this.state.isExpiryDateValid === false
    ) {
      return (
        <Text allowFontScaling={false} style={styles.cardNumberError}>
          {"Invalid expiry date"}
        </Text>
      );
    } else {
      return (
        <Text
          allowFontScaling={false}
          style={{ ...styles.cardNumberError, opacity: 0 }}
        >
          {"Invalid expiry date"}
        </Text>
      );
    }
  }

  cvvNumberTextChange = (text) => {
    this.setState({ cvvNumber: text });
  };

  renderCVVNumberError() {
    let cvvLength = this.state.isAmexCard ? 4 : 3;
    if (
      this.state.cvvNumber.length > 0 &&
      this.state.cvvNumber.length !== cvvLength
    ) {
      return (
        <Text allowFontScaling={false} style={styles.cardNumberError}>
          {"Invalid cvv number"}
        </Text>
      );
    } else {
      return (
        <Text
          allowFontScaling={false}
          style={{ ...styles.cardNumberError, opacity: 0 }}
        >
          {"Invalid cvv number"}
        </Text>
      );
    }
  }
  render() {
    const { navigation } = this.props;
    const articleDetails = navigation.getParam("selectedData", "");

    return (
      <View style={styles.container}>
        {/* Card Number view - started */}
        <View
          style={
            this.props.isFromNewCard
              ? styles.cardNumberViewStyle
              : [styles.cardNumberViewStyle, styles.mS0]
          }
        >
          <Text
            allowFontScaling={false}
            accessibilityLabel="CardNumberText"
            style={styles.cardTextLabelStyle}
          >
            {"Card number"}
          </Text>
          <View style={this.setCardNumberInputViewStyle()}>
            <TextInput
              accessibilityLabel="CardNumber"
              style={this.setCardNumberTextStyle()}
              maxLength={this.state.cardNumberMaxLength}
              ref={(comp) => {
                this.cardNumTxtInputRef = comp;
              }}
              selectionColor="black"
              keyboardType="number-pad"
              returnKeyLabel="Done"
              returnKeyType="done"
              value={this.state.cardNumber}
              onFocus={() => this.paymentTextInputFocus()}
              onChangeText={(text) => this.creditCardTextChange(text)}
              onEndEditing={this.creditCardEndEditing}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === "Backspace") {
                  this.isCardNumberBackSpaceTapped = true;
                } else {
                  this.isCardNumberBackSpaceTapped = false;
                }
              }}
              onSelectionChange={(event) => {
                this.handleSelectionChange(event);
              }}
            />
            {this.renderCancelIconForCardNumber()}
          </View>
          {this.renderCardNumberError()}
        </View>
        {/* Card Number view - finished */}

        {/* Date and CVV view - started */}
        <View
          style={
            this.props.isFromNewCard
              ? styles.dateCVVViewStyle
              : [styles.dateCVVViewStyle, styles.mS0]
          }
        >
          {/* Expiry Date View */}
          <View style={{ flex: 0.5 }}>
            <Text
              allowFontScaling={false}
              accessibilityLabel="ExpiryDateText"
              style={styles.cardTextLabelStyle}
            >
              {"Expiry Date"}
            </Text>
            <TouchableOpacity onPress={() => this.selectExpiryDate()}>
              <View style={this.setExpiryDateInputViewStyle()}>
                <Text
                  accessibilityLabel="ExpiryDate"
                  allowFontScaling={false}
                  style={this.setExpiryDateTextStyle()}
                >
                  {this.state.cardExpiryDate}
                </Text>
              </View>
            </TouchableOpacity>
            {this.renderExpiryDateError()}
          </View>

          {/* CVV View */}
          <View style={{ flex: 0.5, marginLeft: 24 }}>
            <Text
              allowFontScaling={false}
              accessibilityLabel="CVVText"
              style={styles.cardTextLabelStyle}
            >
              {"CVV"}
            </Text>
            <View style={this.setCVVNumberInputViewStyle()}>
              <TextInput
                accessibilityLabel="CVV"
                style={this.setCVVNumberTextStyle()}
                secureTextEntry={true}
                maxLength={this.state.isAmexCard ? 4 : 3}
                selectionColor="black"
                keyboardType="number-pad"
                returnKeyLabel="Done"
                returnKeyType="done"
                value={this.state.cvvNumber}
                onFocus={() => this.paymentTextInputFocus()}
                onChangeText={(text) => this.cvvNumberTextChange(text)}
                onEndEditing={this.cvvNumberEndEditing}
              />
            </View>
            {this.renderCVVNumberError()}
          </View>
        </View>
        {/* Date and CVV view - finished */}
      </View>
    );
  }
}

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//   },
//   logoImage: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   toolbar: {
//     backgroundColor: "#db4b3f",
//     height: 56,
//   },
//   itemImage: {
//     width: Dimensions.get("window").width,
//     height: 220,
//     resizeMode: "cover",
//   },
//   headerTextView: {
//     backgroundColor: "#ADD8E6",
//     flex: 1,
//   },
//   headerText: {
//     color: "white",
//     margin: 10,
//     fontSize: 20,
//     textAlign: "justify",
//     fontWeight: "bold",
//     lineHeight: 25,
//   },
//   regular: {
//     margin: 10,
//     fontSize: 17,
//     textAlign: "justify",
//     lineHeight: 25,
//   },
//   superscript: { fontSize: 8 },
//   strong: { fontSize: 13 },
// });

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: colors.WHITE,
  },
  cardNumberViewStyle: {
    marginVertical: 16,
    marginStart: 24,
    marginRight: 24,
  },
  cardTextLabelStyle: {
    fontSize: 13,
    fontStyle: "normal",
    fontWeight: "normal",
    color: "#222222",
    textAlign: "auto",
  },
  cardNumberInputViewStyle: {
    marginTop: 9,
    borderWidth: 1,
    borderColor: colors.black,
    width: "100%",
    height: windowHeight * 0.06,
    flexDirection: "row",
  },
  cardNumberTextInputStyle: {
    marginHorizontal: 12,
    marginVertical: IS_ANDROID ? 0 : 12,
    height: IS_ANDROID ? windowHeight * 0.06 : windowHeight * 0.06 - 24,
    flex: 0.9,
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "normal",
    color: "#222222",
    textAlign: "auto",
  },
  cardNumberCancelViewStyle: {
    flex: 0.1,
    alignItems: "center",
    justifyContent: "center",
  },
  cardNumberError: {
    fontSize: 11,
    fontStyle: "normal",
    fontWeight: "normal",
    color: colors.red,
    textAlign: "auto",
  },
  dateCVVViewStyle: {
    marginTop: 16,
    marginStart: 24,
    marginRight: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  expiryDateInputViewStyle: {
    marginTop: 9,
    borderWidth: 1,
    borderColor: colors.black,
    width: "100%",
    height: windowHeight * 0.06,
    flexDirection: "column",
    justifyContent: "center",
  },
  expiryDateTextStyle: {
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "normal",
    color: "#222222",
    textAlign: "auto",
    marginLeft: 12,
  },
  cvvNumberTextInputStyle: {
    marginHorizontal: 12,
    marginVertical: IS_ANDROID ? 0 : 12,
    height: IS_ANDROID ? windowHeight * 0.06 : windowHeight * 0.06 - 24,
    flex: 0.8,
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "normal",
    color: "#222222",
    textAlign: "auto",
  },
  cvvInfoViewStyle: {
    flex: 0.2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  cardsHighlightViewStyle: {
    marginVertical: 10,
    marginStart: 24,
    marginRight: 24,
    height: windowHeight * 0.04,
    flexDirection: "row",
    alignItems: "center",
  },
  saveCardFutureViewStyle: {
    marginBottom: 10,
    marginRight: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: windowHeight * 0.06,
  },
  saveCardTextStyle: {
    fontSize: 13,
    fontStyle: "normal",
    fontWeight: "normal",
    color: "#222222",
    textAlign: "auto",
    marginLeft: 24,
  },
  mS0: {
    marginStart: 0,
  },
  mL0: {
    marginLeft: 0,
  },
});
