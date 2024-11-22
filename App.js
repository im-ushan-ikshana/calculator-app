// App.js

import React, { useState, useCallback } from 'react';
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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { create, all } from 'mathjs';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const math = create(all);

export default function App() {
  const [display, setDisplay] = useState('');
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [isErrorVisible, setIsErrorVisible] = useState(false);

  const [fontsLoaded] = useFonts({
    OpenSans: require('./assets/fonts/opensans.ttf'),
  });

  // Callback to hide the splash screen when fonts are loaded
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Render nothing until fonts are loaded
  }

  const handlePress = (value) => {
    setError('');
    if (value === 'C') {
      setDisplay('');
    } else if (value === '=') {
      try {
        const result = evaluateExpression(display);
        setHistory([...history, `${display} = ${result}`]);
        setDisplay(result.toString());
      } catch (e) {
        setError(e.message);
        setIsErrorVisible(true);
        setDisplay('');
      }
    } else {
      setDisplay(display + value);
    }
  };

  const handleBackspace = () => {
    setDisplay(display.slice(0, -1));
  };

  const evaluateExpression = (expression) => {
    const sanitizedExpression = expression.replace(/×/g, '*').replace(/÷/g, '/');

    const result = math.evaluate(sanitizedExpression);

    if (!isFinite(result)) {
      throw new Error('Cannot divide by zero.');
    }
    return result;
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const toggleHistory = () => {
    setIsHistoryVisible(!isHistoryVisible);
  };

  const toggleError = () => {
    setIsErrorVisible(!isErrorVisible);
  };

  const styles = createStyles(isDarkTheme);

  return (
    <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Pandas Cal</Text>
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