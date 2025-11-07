import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
// import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackGroundImage from '../../assets/LoginBackImage.png';
import { useAuth } from '../context/AuthContext';
import BackButton from '../components/BackButton';
import FooterButtons from '../components/FooterButtons';
import { TextInput } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth();
  const [oldEmail, setOldEmail] = useState(0);
  const initialValue = {
    email: '',
    password: '',
  };
  const [localstate, setLocalstate] = useState([initialValue]);

  const onContinue = async () => {
    // For demo/navigation purposes navigate into the App stack to Dashboard.
    // In a real app, replace this with signIn(email,password) and let auth state drive navigation.
    // debugger;
    if(localstate.email != '' && localstate.email != undefined){
      navigation.navigate('App', { screen: 'Dashboard' });
    }else{
      alert('Please enter a valid email address');
    }
    
    // setOldEmail(1);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* show back button only if we can go back */}
        {navigation.canGoBack() && <BackButton style={{ alignSelf: 'flex-start' }} />}
        <Image source={BackGroundImage} style={styles.illustration} />

        <View style={styles.card}>
          <Text style={styles.emoji}>✨</Text>
          <Text style={styles.title}>Welcome!</Text>
          <Text style={styles.subtitle}>
            Plan your day with ease. Organize tasks, set goals, and stay on
            track.
          </Text>

          <TouchableOpacity
            style={styles.outlineButton}
            activeOpacity={0.8}            
          >
            <View style={styles.iconBox}>
              <Text style={styles.icon}>✉️</Text>
            </View>
            {/* <Text style={styles.outlineButtonText}>Continue with Email</Text> */}
            <TextInput style={styles.outlineButtonTextInput} placeholder="Continue with Email" keyboardType='email-address' onChangeText={newText => 
              setLocalstate({ ...localstate, email: newText })
            }/>
            <Text style={styles.outlineButtonText}>
              {/* Changed to Unicode right arrow */}
              <Text style={styles.rightArrow} onPress={onContinue}>&#8594;</Text>
            </Text>
          </TouchableOpacity>
          {/* <View style={styles.fixToText}>
            <Button
              title="Press Me"
              // onPress={handlePress}
            />

          </View> */}
{/*           
          <TouchableOpacity style={styles.footerBtn}>
            <Text style={styles.footerBtnText}>SignIn</Text>
          </TouchableOpacity> */}

          {/* <button>signIn</button> */}
{/* 
          {oldEmail == 1 ? (
            <>
              <Text>Previous email used: </Text>
              <TouchableOpacity
                style={styles.outlineButton}
                activeOpacity={0.8}
              >
                <View style={styles.iconBox}>
                  <Text style={styles.icon}>✉️</Text>
                </View>
                <TextInput style={styles.outlineButtonTextInput} placeholder="Enter your email" />
              </TouchableOpacity>
            </>
            ): (null)} */}

          {/* <TouchableOpacity>
            <Text style={styles.signupLink}>Create new account</Text>
          </TouchableOpacity> */}
          {/* <FooterButtons onAddTask={() => alert('Add Task pressed')} onRefresh={() => alert('Refresh pressed')} /> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFB' },
  container: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  // style={{fontSize: 30, color: 'rgba(127, 71, 71, 1)'}}
  rightArrow: {
    fontSize: 50,
    // height: 80,
    color: 'rgba(127, 71, 71, 1)',
    // backgroundColor: '#1b6e98ff',
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  illustration: {
    width: Math.min(327, width - 48),
    height: 307,
    resizeMode: 'cover',
    marginTop: 20,
    alignSelf: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  card: {
    width: '100%',
    marginTop: 8,
    paddingVertical: 18,
    paddingHorizontal: 12,
  },
  emoji: {
    fontSize: 18,
    marginBottom: 6,
    color: '#2E8B57',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 18,
    maxWidth: 420,
  },
  outlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
    marginBottom: 12,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: { fontSize: 14 },
  outlineButtonText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
  },
  outlineButtonTextInput: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
    // backgroundColor: '#8e7373ff',
    width: '75%',
  },
  signupLink: {
    color: '#16A34A',
    marginTop: 6,
    fontSize: 14,
  },
  footerBtn: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 224,
    marginHorizontal: 8,
  },
  footerBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
