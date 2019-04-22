import React from 'react';
import { FlatList, ActivityIndicator, Text, View, Button  } from 'react-native';
import {createStackNavigator, createAppContainer, StackActions, NavigationActions } from 'react-navigation';

class HomeScreen extends React.Component {
  constructor(props){
    super(props);
    this.state ={ isLoading: true}
  }

  componentDidMount(){
    return fetch('http://157.230.153.186/api/landing_page')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          dataSource: responseJson.causes,
        }, function(){

        });

      })
      .catch((error) =>{
        console.error(error);
      });
  }



  render(){

    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }

    return(
      <View style={{flex: 1, paddingTop:20}}>
        <FlatList
          data={this.state.dataSource}
          renderItem={({item}) => <Text>{item.title}, {item.description}</Text>}
          keyExtractor={({id}, index) => id}
        />
        <Button
        title="Go to Family Event"
          onPress={() => {
            this.props.navigation.dispatch(StackActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({ routeName: 'Section' , cause_type: "FamilyEvent"})
              ],
            }))
          }}
      />
      </View>
    );
  }
}

class SectionScreen extends React.Component {

// export default class FetchExample extends React.Component {

  constructor(props){
    super(props);
    this.state ={ isLoading: true}
  }


  componentDidMount(){
    const { navigation } = this.props;
    const cause_type = navigation.getParam('cause_type', 'Medical');
    return fetch('http://157.230.153.186/api/section_page/?cause_type='+cause_type)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          dataSource: responseJson.causes,
        }, function(){

        });

      })
      .catch((error) =>{
        console.error(error);
      });
  }



  render(){

    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }

    // const cause_type = this.props.getParam('otherParam', 'Medical')

    return(
      <View style={{flex: 1, paddingTop:20}}>
        <FlatList
          data={this.state.dataSource}
          renderItem={({item}) => <Text>{item.title}, {item.description}</Text>}
          keyExtractor={({id}, index) => id}
        />
        <Button
        title="Go to Home"
          onPress={() => {
            this.props.navigation.dispatch(StackActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({ routeName: 'Home' })
              ],
            }))
          }}
      />
      </View>
    );
  }
}


const AppNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen,
  },
  Section: {
    screen: SectionScreen,
  },
}, {
    initialRouteName: 'Home',
});

export default createAppContainer(AppNavigator);