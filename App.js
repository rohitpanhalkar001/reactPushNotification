
import React, {Component} from 'react';
import { AsyncStorage, View, Alert, Text } from 'react-native';
import firebase from 'react-native-firebase';



export default class App extends Component {

async componentDidMount() {
  this.checkPermission();
  this.createNotificationListeners(); //add this line
}



componentWillUnmount() {
  this.notificationListener();
  this.notificationOpenedListener();
  this.messageListener();
  this.notificationDisplayedListener();

}

  //1
async checkPermission() {
  const enabled = await firebase.messaging().hasPermission();
  console.log('check Premission ',enabled);
  if (enabled) {
      this.getToken();
  } else {
      this.requestPermission();
  }
}


async createNotificationListeners() {
  /*
  * Triggered when a particular notification has been received in foreground
  * */

  this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification) => {
    const { title, body } = notification;
    console.warn(JSON.stringify(title));
    console.warn(JSON.stringify(body));
    this.showAlert(title,body);
     
  });




  this.notificationListener = firebase.notifications().onNotification((notification) => {
    const { title, body } = notification;
    this.showAlert(title,body);
    console.warn(JSON.stringify(title));
    console.warn(JSON.stringify(body));
  });

  /*
  * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
  * */
  this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      const { title, body } = notificationOpen.notification;
      console.warn(JSON.stringify(title));
    console.warn(JSON.stringify(body));
      this.showAlert(title, body);

  });

  /*
  * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
  * */
  const notificationOpen = await firebase.notifications().getInitialNotification();
  if (notificationOpen) {
   
      const { title, body } = notificationOpen.notification;
      console.warn(JSON.stringify(title));
      console.warn(JSON.stringify(body));
      this.showAlert(title, body);

  }
  /*
  * Triggered for data only payload in foreground
  * */
  this.messageListener = firebase.messaging().onMessage((message) => {
    //process data message
    console.log(JSON.stringify(message));


  });
}

showAlert(title, body) {
  Alert.alert(
    title, body,
    [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
    ],
    { cancelable: false },
  );
}

  //3
async getToken() {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
          // user has a device token
          await AsyncStorage.setItem('fcmToken', fcmToken);
      }
  }
}


  //2
async requestPermission() {
  try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
  } catch (error) {
      // User has rejected permissions
      console.warn('permission rejected');
  }
}

  render() {
    return (
      <View style={{flex: 1}}>
        <Text>Welcome to React Native!</Text>
      </View>
    );
  }

  
}
 
