import React from 'react';
import {
  FlatList,
  ActivityIndicator,
  Text,
  View,
  Button,
  Form,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  Alert,
  AsyncStorage,
} from 'react-native';
import {
  createStackNavigator,
  createAppContainer,
  StackActions,
  NavigationActions,
} from 'react-navigation';

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: true };
  }

  componentDidMount() {
    return fetch('http://157.230.153.186/api/landing_page')
      .then(response => response.json())
      .then(responseJson => {
        this.setState(
          {
            isLoading: false,
            dataSource: responseJson.causes,
          },
          function() {}
        );
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, padding: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={{ flex: 1, paddingTop: 20 }}>
        <FlatList
          data={this.state.dataSource}
          renderItem={({ item }) => (
            <Text>
              {item.title}, {item.description}
            </Text>
          )}
          keyExtractor={({ id }, index) => id}
        />
        <Button
          title="Create a cause"
          onPress={() => {
            this.props.navigation.dispatch(
              StackActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({ routeName: 'CreateCause' }),
                ],
              })
            );
          }}
        />
        <Button
          title="Go to Family Event"
          onPress={() => {
            this.props.navigation.dispatch(
              StackActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({
                    routeName: 'Section',
                    cause_type: 'FamilyEvent',
                  }),
                ],
              })
            );
          }}
        />
        <Button
          title="Make Contribution"
          onPress={() => {
            this.props.navigation.dispatch(
              StackActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({
                    routeName: 'MakeContribution'
                  }),
                ],
              })
            );
          }}
        />
      </View>
    );
  }
}

// Currently goes to default rather than using the parameter
class SectionScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: true };
  }

  componentDidMount() {
    const { navigation } = this.props;
    const cause_type = navigation.getParam('cause_type', 'Medical');
    return fetch(
      'http://157.230.153.186/api/section_page/?cause_type=' + cause_type
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState(
          {
            isLoading: false,
            dataSource: responseJson.causes,
          },
          function() {}
        );
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, padding: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={{ flex: 1, paddingTop: 20 }}>
        <FlatList
          data={this.state.dataSource}
          renderItem={({ item }) => (
            <Text>
              {item.title}, {item.description}
            </Text>
          )}
          keyExtractor={({ id }, index) => id}
        />
        <Button
          title="Go to Home"
          onPress={() => {
            this.props.navigation.dispatch(
              StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Home' })],
              })
            );
          }}
        />
      </View>
    );
  }
}

class CreateCauseScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true ,
      title : '',
      description : '',
      cover_image : '',
      target : '',
      deadline : '',
      username : '',
      cause_type : ''
    }
  }

  registerAccount = () => {
    if (!this.state.title) {
      Alert.alert('Please enter a title');
    } else if (!this.state.description) {
      Alert.alert('Please enter your description');
    } else if (!this.state.target) {
      Alert.alert('Please enter a target');
    } else if (!this.state.deadline) {
      Alert.alert('Please enter a deadline');
    } else if (!this.state.username) {
      Alert.alert('Please enter a username');
    } else {
          fetch('http://157.230.153.186/api/create_cause/', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              "title": this.state.title,
              "description": this.state.description,
              "cover_image": this.state.cover_image,
              "target": this.state.target,
              "deadline": this.state.deadline,
              "username": this.state.username,
              "cause_type": this.state.cause_type
            }),
          })
            .then(response => response.json())
            .then(responseJson => {
              Alert.alert(`${this.state.title} cause created`);
              this.setState(
                {
                  isLoading: false,
                },
                function() {}
              );
              this.props.navigation.navigate('Home');
            })
            .catch(error => {
              Alert.alert(`${error}`);
              this.props.navigation.navigate('Home');
            });
        }
  };

  render() {
    return (
      <View style={{ flex: 1, paddingTop: 20 }}>
        <View style={styles.container}>
          <Text style={styles.heading}>Create a cause</Text>
          <Text style={styles.label}>Enter Title</Text>
          <TextInput
            style={styles.inputs}
            onChangeText={(text) => this.setState({title: text})}
            value={this.state.title}
          />
          <Text style={styles.label}>Enter cause description</Text>
          <TextInput
            style={styles.inputs}
            onChangeText={(text) => this.setState({ description: text })}
            value={this.state.description}
          />
          <Text style={styles.label}>Enter cover image</Text>
          <TextInput
            style={styles.inputs}
            onChangeText={(text) => this.setState({ cover_image: text })}
            value={this.state.cover_image}
          />
          <Text style={styles.label}>Enter target</Text>
          <TextInput
            style={styles.inputs}
            onChangeText={(text) => this.setState({ target: text })}
            value={this.state.target}
          />
          <Text style={styles.label}>Enter deadline</Text>
          <TextInput
            style={styles.inputs}
            onChangeText={(text) => this.setState({ deadline: text })}
            value={this.state.deadline}
          />
          <Text style={styles.label}>Enter username</Text>
          <TextInput
            style={styles.inputs}
            onChangeText={(text) => this.setState({username: text})}
            value={this.state.username}
          />
          <Text style={styles.label}>Enter cause type</Text>
          <TextInput
            style={styles.inputs}
            onChangeText={(text) => this.setState({ cause_type: text })}
            value={this.state.cause_type}
          />
          <TouchableHighlight
            onPress={this.registerAccount}
            underlayColor={'#31e981'}>
            <Text style={styles.buttons}>Register</Text>
          </TouchableHighlight>
        </View>
        <Button
          title="Go to Family Event"
          onPress={() => {
            this.props.navigation.dispatch(
              StackActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({
                    routeName: 'Section',
                    cause_type: 'FamilyEvent',
                  }),
                ],
              })
            );
          }}
        />
      </View>
    );
  }
}

class MakeContributionScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true ,
      contribution : 0,
      cause_id : '',
      user_id : ''
    }
  }

  MakeContribution = () => {
    if (!this.state.contribution) {
      Alert.alert('Please enter a contribution');
    } else if (!this.state.cause_id) {
      Alert.alert('Please enter the cause_id');
    } else if (!this.state.user_id) {
      Alert.alert('Please enter user_id');
    } else {
          fetch('http://157.230.153.186/api/make_contribution/', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              "contribution": this.state.contribution,
              "cause_id": this.state.cause_id,
              "user_id": this.state.user_id
            }),
          })
            .then(response => response.json())
            .then(responseJson => {
              Alert.alert(`USD ${this.state.contribution} contributed`);
              this.setState(
                {
                  isLoading: false,
                },
                function() {}
              );
              this.props.navigation.navigate('Home');
            })
            .catch(error => {
              Alert.alert(`${error}`);
              this.props.navigation.navigate('Home');
            });
        }
  };

  render() {
    return (
      <View style={{ flex: 1, paddingTop: 20 }}>
        <View style={styles.container}>
          <Text style={styles.heading}>Make a contribution</Text>
          <Text style={styles.label}>Enter Amount</Text>
          <TextInput
            style={styles.inputs}
            keyboardType='numeric'
            onChangeText={(text) => this.setState({contribution: Number(text)})}
            value={this.state.contribution}
          />
          <Text style={styles.label}>Enter cause id</Text>
          <TextInput
            style={styles.inputs}
            keyboardType='numeric'
            onChangeText={(text) => this.setState({ cause_id: text })}
            value={this.state.cause_id}
          />
          <Text style={styles.label}>Enter user id</Text>
          <TextInput
            style={styles.inputs}
            keyboardType='numeric'
            onChangeText={(text) => this.setState({ user_id: text })}
            value={this.state.user_id}
          />
          <TouchableHighlight
            onPress={this.MakeContribution}
            underlayColor={'#31e981'}>
            <Text style={styles.buttons}>Contribute</Text>
          </TouchableHighlight>
        </View>
        <Button
          title="Go to Family Event"
          onPress={() => {
            this.props.navigation.dispatch(
              StackActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({
                    routeName: 'Section',
                    cause_type: 'FamilyEvent',
                  }),
                ],
              })
            );
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
  CreateCause: {
    screen: CreateCauseScreen,
  },
  MakeContribution: {
    screen: MakeContributionScreen,
  },
  initialRouteName: 'Home',
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: '45%',
    paddingTop: '10%',
  },
  heading: {
    fontSize: 16,
    flex: 1,
  },
  inputs: {
    flex: 1,
    width: '80%',
    padding: 10,
  },
  buttons: {
    marginTop: 15,
    fontSize: 16,
  },
  label: {
    paddingBottom: 10,
  },
});

export default createAppContainer(AppNavigator);