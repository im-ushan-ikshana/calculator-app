// App.js
//import section
//importing the required components from the libraries - react, react-native, expo-font, expo-splash-screen, mathjs
import React, { useState, useCallback } from 'react';

//importing the required components from the libraries - react-native, expo-vector-icons
//ui components - View, Text, TouchableOpacity, Modal, FlatList, SafeAreaView, Dimensions, TouchableWithoutFeedback
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  FlatList,
  SafeAreaView,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';

//impoert vector icons from expo-vector-icons
import { MaterialCommunityIcons } from '@expo/vector-icons';

//importing the required components from the libraries - expo-font, expo-splash-screen
import { useFonts } from 'expo-font';

//importing the required components from the libraries - expo-splash-screen
//splash screen - preventAutoHideAsync, hideAsync
import * as SplashScreen from 'expo-splash-screen';

//importing the required components from the libraries - mathjs
import { create, all } from 'mathjs';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Create a mathjs instance with all the functions
const math = create(all);

//exporting the App function
//App function - functional component
//App function returns the JSX
export default function App() {
  //useState hooks
  //useState hooks - display, setDisplay - used for displaying the input and output
  const [display, setDisplay] = useState('');

  //useState hooks - error, setError - used for displaying the error message
  const [error, setError] = useState('');

  //useState hooks - history, setHistory - used for storing the history of calculations
  const [history, setHistory] = useState([]);

  //useState hooks - isDarkTheme, setIsDarkTheme - used for toggling the theme
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  //useState hooks - isHistoryVisible, setIsHistoryVisible - used for toggling the history modal
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

  //useState hooks - isErrorVisible, setIsErrorVisible - used for toggling the error modal
  const [isErrorVisible, setIsErrorVisible] = useState(false);

  //useFonts hook - fontsLoaded - used for loading the custom font
  const [fontsLoaded] = useFonts({
    OpenSans: require('./assets/fonts/opensans.ttf'),
  });

  // Callback to hide the splash screen when fonts are loaded - onLayoutRootView
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Render nothing until fonts are loaded
  }

  //handlePress function - used for handling the button press
  const handlePress = (value) => {
    //if the value is 'C', then set the display to empty string
    setError('');
    if (value === 'C') {
      setDisplay('');
    } else if (value === '=') {
      //if the value is '=', then evaluate the expression and set the result to display
      try {
        const result = evaluateExpression(display);
        //add the expression and result to the history - ...history, `${display} = ${result}`
        setHistory([...history, `${display} = ${result}`]);
        //setDisplay(result.toString()) - set the result to display
        setDisplay(result.toString());
      } catch (e) {
        //if there is an error, set the error message to display
        setError(e.message);
        //setIsErrorVisible(true) - set the error modal to visible
        setIsErrorVisible(true);
        setDisplay('');
      }
    } else {
      //if the value is not 'C' or '=', then add the value to the display
      setDisplay(display + value);
    }
  };

  //handleBackspace function - used for handling the backspace button press
  //when the backspace button is pressed, the last character is removed from the display
  const handleBackspace = () => {
    setDisplay(display.slice(0, -1));
  };

  //evaluateExpression function - used for evaluating the expression
  //the expression is sanitized and evaluated using mathjs
  //in here × is replaced with * and ÷ is replaced with /
  const evaluateExpression = (expression) => {
    const sanitizedExpression = expression.replace(/×/g, '*').replace(/÷/g, '/');

    //result - math.evaluate(sanitizedExpression) - evaluate the expression using mathjs
    const result = math.evaluate(sanitizedExpression);

    //if the result is not a finite number, then throw an error
    if (!isFinite(result)) {
      throw new Error('Cannot divide by zero.');
    }
    return result;
  };

  //toggleTheme function - used for toggling the theme
  //here, the isDarkTheme is toggled - funcitonality to switch between dark and light themes
  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  //toggleHistory function - used for toggling the history modal
  //here, the isHistoryVisible is toggled - functionality to show and hide the history modal
  const toggleHistory = () => {
    setIsHistoryVisible(!isHistoryVisible);
  };

  //toggleError function - used for toggling the error modal
  //here, the isErrorVisible is toggled - functionality to show and hide the error modal
  const toggleError = () => {
    setIsErrorVisible(!isErrorVisible);
  };

  //createStyles function - used for creating the styles based on the theme
  //the styles are created based on the isDarkTheme
  const styles = createStyles(isDarkTheme);

  //return the JSX
  //here the main JSX is returned - detailed explanation is provided in the comments
  return (
    //SafeAreaView - used for providing padding for the status bar
    <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
      {/* Header */}
      {/* Header Container - contains the header and theme button */}
      {/* Header - contains the title of the app */}
      {/* Theme Button - used for toggling the theme */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Pandas Cal</Text>
        {/* Theme Button */}
        <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
          <MaterialCommunityIcons
            name={isDarkTheme ? 'weather-night' : 'white-balance-sunny'}
            size={32}
            color={isDarkTheme ? '#fff' : '#000'}
          />
        </TouchableOpacity>
      </View>

      {/* History Toggle */}
      <TouchableOpacity onPress={toggleHistory} style={styles.historyToggle}>
        <Text style={styles.historyToggleText}>History</Text>
        <MaterialCommunityIcons
          name="chevron-down"
          size={24}
          color={isDarkTheme ? '#fff' : '#000'}
        />
      </TouchableOpacity>

      {/* Display */}
      <View style={styles.displayContainer}>
        <Text style={styles.displayText}>{display || '0'}</Text>
        <TouchableOpacity onPress={handleBackspace} style={styles.backspaceButton}>
          <MaterialCommunityIcons
            name="backspace"
            size={32}
            color={isDarkTheme ? '#fff' : '#000'}
          />
        </TouchableOpacity>
      </View>

      {/* Calculator Buttons */}
      <View style={styles.buttonContainer}>
        {/* First Row */}
        <View style={styles.buttonRow}>
          {['C', '(', ')', '÷'].map((item) => (
            <CalculatorButton
              key={item}
              value={item}
              onPress={handlePress}
              isOperator={['÷'].includes(item)}
              isSpecial={item === 'C'}
              isEqual={false}
              isDarkTheme={isDarkTheme}
            />
          ))}
        </View>
        {/* Second Row */}
        <View style={styles.buttonRow}>
          {['7', '8', '9', '×'].map((item) => (
            <CalculatorButton
              key={item}
              value={item}
              onPress={handlePress}
              isOperator={['×'].includes(item)}
              isSpecial={false}
              isEqual={false}
              isDarkTheme={isDarkTheme}
            />
          ))}
        </View>
        {/* Third Row */}
        <View style={styles.buttonRow}>
          {['4', '5', '6', '-'].map((item) => (
            <CalculatorButton
              key={item}
              value={item}
              onPress={handlePress}
              isOperator={['-'].includes(item)}
              isSpecial={false}
              isEqual={false}
              isDarkTheme={isDarkTheme}
            />
          ))}
        </View>
        {/* Fourth Row */}
        <View style={styles.buttonRow}>
          {['1', '2', '3', '+'].map((item) => (
            <CalculatorButton
              key={item}
              value={item}
              onPress={handlePress}
              isOperator={['+'].includes(item)}
              isSpecial={false}
              isEqual={false}
              isDarkTheme={isDarkTheme}
            />
          ))}
        </View>
        {/* Fifth Row */}
        <View style={styles.buttonRow}>
          {['.', '0', '='].map((item) => (
            <CalculatorButton
              key={item}
              value={item}
              onPress={handlePress}
              isOperator={['='].includes(item)}
              isSpecial={false}
              isEqual={item === '='}
              isDarkTheme={isDarkTheme}
            />
          ))}
        </View>
      </View>

      {/* History Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isHistoryVisible}
        onRequestClose={toggleHistory}
      >
        <TouchableWithoutFeedback onPress={toggleHistory}>
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>History</Text>
                  <TouchableOpacity onPress={toggleHistory}>
                    <MaterialCommunityIcons
                      name="close"
                      size={24}
                      color={isDarkTheme ? '#fff' : '#000'}
                    />
                  </TouchableOpacity>
                </View>
                {history.length > 0 ? (
                  <FlatList
                    data={history.slice().reverse()}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <Text style={styles.historyItem}>{item}</Text>
                    )}
                    style={styles.historyList}
                  />
                ) : (
                  <Text style={styles.noHistoryText}>No history available.</Text>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Error Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isErrorVisible}
        onRequestClose={toggleError}
      >
        <TouchableWithoutFeedback onPress={toggleError}>
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Error</Text>
                  <TouchableOpacity onPress={toggleError}>
                    <MaterialCommunityIcons
                      name="close"
                      size={24}
                      color={isDarkTheme ? '#fff' : '#000'}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.errorMessage}>{error}</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const CalculatorButton = ({
  value,
  onPress,
  isOperator,
  isSpecial,
  isEqual,
  isDarkTheme,
}) => {
  const styles = createStyles(isDarkTheme);
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isOperator && styles.operatorButton,
        isSpecial && styles.specialButton,
        isEqual && styles.equalButton,
      ]}
      onPress={() => onPress(value)}
    >
      <Text style={styles.buttonText}>{value}</Text>
    </TouchableOpacity>
  );
};

const createStyles = (isDarkTheme = true) => {
  const { height } = Dimensions.get('window');

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkTheme ? '#333' : '#f0f0f0',
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingTop: 40,
      paddingBottom: 10,
    },
    header: {
      fontSize: 32,
      color: isDarkTheme ? '#fff' : '#000',
      fontWeight: 'bold',
    },
    themeButton: {
      padding: 5,
    },
    historyToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
    },
    historyToggleText: {
      fontSize: 20,
      color: isDarkTheme ? '#fff' : '#000',
      marginRight: 5,
    },
    displayContainer: {
      flexGrow: 1,
      backgroundColor: isDarkTheme ? '#222' : '#e0e0e0',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
      marginHorizontal: 10,
      marginBottom: 10,
      position: 'relative',
    },
    displayText: {
      flex: 1,
      fontSize: 60,
      color: isDarkTheme ? '#fff' : '#000',
      textAlign: 'right',
      fontFamily: 'OpenSans',
      paddingRight: 40, // To avoid overlap with the backspace icon
    },
    backspaceButton: {
      position: 'absolute',
      bottom: 10,
      right: 10,
    },
    buttonContainer: {
      paddingHorizontal: 5,
      paddingBottom: 10,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    button: {
      backgroundColor: isDarkTheme ? '#555' : '#ddd',
      flex: 1,
      margin: 5,
      paddingVertical: 20,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    operatorButton: {
      backgroundColor: isDarkTheme ? '#f09a36' : '#f0a500',
    },
    specialButton: {
      backgroundColor: isDarkTheme ? '#ff5c5c' : '#ff7f7f',
    },
    equalButton: {
      backgroundColor: isDarkTheme ? '#00bfff' : '#1e90ff',
    },
    buttonText: {
      color: isDarkTheme ? '#fff' : '#000',
      fontSize: 28,
      fontWeight: 'bold',
    },
    modalBackground: {
      flex: 1,
      backgroundColor: isDarkTheme ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      width: '90%',
      maxHeight: '80%',
      backgroundColor: isDarkTheme ? '#333' : '#fff',
      borderRadius: 10,
      padding: 15,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    modalTitle: {
      fontSize: 24,
      color: isDarkTheme ? '#fff' : '#000',
      fontWeight: 'bold',
    },
    errorMessage: {
      fontSize: 18,
      color: isDarkTheme ? '#fff' : '#000',
      textAlign: 'center',
      marginTop: 20,
    },
    historyList: {
      maxHeight: '80%',
    },
    historyItem: {
      fontSize: 18,
      color: isDarkTheme ? '#fff' : '#000',
      marginVertical: 2,
    },
    noHistoryText: {
      fontSize: 18,
      color: isDarkTheme ? '#fff' : '#000',
      textAlign: 'center',
      marginTop: 20,
    },
  });
};