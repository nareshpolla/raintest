import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  StatusBar
} from "react-native";
import { HeaderBackButton } from "react-navigation";
import Icon from 'react-native-vector-icons/Ionicons';



export default class ArticleDetails extends Component {
  static navigationOptions = ({ navigation }) => {
    const selectedData = navigation.getParam("selectedData", "");

    var navOptions = {
      title: "Article Details",
          backgroundColor:"#ADD8E6",
          color: "#ADD8E6",
          headerTintColor: "#ADD8E6"
    };

    if (selectedData != "") {
      navOptions.title = "Article Details";
      navOptions.headerLeft = (
        <HeaderBackButton
          tintColor="white"
          onPress={() => navigation.goBack(null)}
        />
      );
    }

    return navOptions;
  };
  constructor(props){
    super(props);
  }
  componentWillMount(){
    const { navigation } = this.props;

    const articleDetails = navigation.getParam("selectedData", "");

    this.setState = {
      title: "Article Details"
    };
  }
  render() {
    const { navigation } = this.props;
    const articleDetails = navigation.getParam("selectedData", "");

    return (
      <View style={styles.container}>
      {/* <StatusBar backgroundColor="#c62726" barStyle="light-content"/>
        <Icon.ToolbarAndroid style={styles.toolbar} title="NY Times Article Details" titleColor="white"
          navIconName="md-menu"
          actions={[
            { title: 'About', iconName: 'md-help', iconSize:30, show: 'never' },
          ]}
          overflowIconName="md-more" />
         */}
          <Text style={styles.regular}>{articleDetails.abstract}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  logoImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  toolbar: {
    backgroundColor: '#db4b3f',
    height: 56
  },
  itemImage: {
    width: Dimensions.get("window").width,
    height: 220,
    resizeMode: "cover"
  },
  headerTextView: {
    backgroundColor: "#ADD8E6",
    flex: 1
  },
  headerText: {
    color: "white",
    margin: 10,
    fontSize: 20,
    textAlign: "justify",
    fontWeight: "bold",
    lineHeight: 25
  },
  regular: {
    margin: 10,
    fontSize: 17,
    textAlign: "justify",
    lineHeight: 25
  },
  superscript: { fontSize: 8 },
  strong: { fontSize: 13 }
});
