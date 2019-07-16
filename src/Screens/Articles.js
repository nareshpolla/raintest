import React, { Component } from 'react';import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableHighlight,
    StatusBar
  } from 'react-native';
  
  import {
    Colors,
  } from 'react-native/Libraries/NewAppScreen';

  import Icon from 'react-native-vector-icons/Ionicons';
  

export default class Articles extends Component {

    static navigationOptions = ({ navigation }) => {
        const selectedData = navigation.getParam("selectedData", "");
    
        var navOptions = {
          title: "NY Times Most Popular",
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
        this.state={
          res:[]
        }
        fetch("https://api.nytimes.com/svc/mostpopular/v2/mostviewed/all-sections/1.json?api-key=a69e1cdbb16b4f23841c8f01be77f31a").then(res => res.json())
        .then(res => this.setState({res:res.results}))
      }
    
    
      renderItem = ({ item}) => {
        return(
          <TouchableHighlight
            onPress = {() => this.goToNextScreen(item)}
            underlayColor = "transparent"
          >
          <View style = {styles.itemBlock}>
            <Text style={styles.itemName}>{item.title}</Text>
            <Text style={styles.itemCategoryName}>{item.byline}</Text>
            <Text style={styles.itemCategoryName}>{item.published_date}</Text>
    
          </View>
          </TouchableHighlight>
        )
      }
    
      goToNextScreen = item => {
          return this.props.navigation.navigate("ArticleDetails", {selectedData: item});
      };
    
      render(){
      return (
        <View style= {styles.container}>
        <StatusBar backgroundColor="#82CAFA" barStyle="light-content"/>
        
        <FlatList
          data = {this.state.res}
          renderItem={this.renderItem}
          keyExtractor = {(item, index) => index}
         />
    
        </View>
      //  <View>
      //  {this.state.res&&this.state.res.length>=1&&this.state.res.map(x =>{
      //    return(
      //      <View>
      //     <Text>{x.title}</Text>
      //     <Text>{x.abstract}</Text>
      //     </View>
      //    )
      //  })}
         
      //  </View>
      );
      }
    };
    
    const styles = StyleSheet.create({
      scrollView: {
        backgroundColor: Colors.lighter,
      },
      container: {
        flex: 1,
        backgroundColor: '#F5FCFF'
      },
      itemBlock: {
        backgroundColor: "#ADD8E6",
        flexDirection: "column",
        margin: 10,
        paddingBottom: 5,
        borderRadius: 15,
        overflow: "hidden"
      },
      toolbar: {
        backgroundColor: '#db4b3f',
        height: 56
      },
      itemName: {
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "left"
      },
      itemCategoryName: {
          marginLeft: 10,
          marginRight: 10,
          marginBottom: 10,
          color: "white",
          fontSize: 14,
          textAlign: "left"
      },
      engine: {
        position: 'absolute',
        right: 0,
      },
      body: {
        backgroundColor: Colors.white,
      },
      sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
      },
      sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.black,
      },
      sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
        color: Colors.dark,
      },
      highlight: {
        fontWeight: '700',
      },
      footer: {
        color: Colors.dark,
        fontSize: 12,
        fontWeight: '600',
        padding: 4,
        paddingRight: 12,
        textAlign: 'right',
      },
    });

