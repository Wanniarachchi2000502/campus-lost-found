import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Field, Button, s } from '../components';
import { useAuth } from '../AuthContext';
import { errMsg } from '../api';
import { C } from '../config';

export default function Login({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const e = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Enter a valid email address';
    if (!password) e.password = 'Enter your password';
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    try { await login(email.trim(), password); } catch (err) { setErrors({ form: errMsg(err) }); }
    setLoading(false);
  };

  return (
    <ScrollView style={s.screen} contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
      <Text style={{ fontSize: 28, fontWeight: '800', color: C.ink, marginTop: 20 }}>Campus Lost & Found</Text>
      <Text style={{ color: C.muted, marginBottom: 28, marginTop: 6 }}>Report what you found. Find what you lost.</Text>
      <Field label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" error={errors.email} />
      <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry error={errors.password} />
      {errors.form ? <Text style={[s.err, { marginBottom: 10 }]}>{errors.form}</Text> : null}
      <Button title="Log in" onPress={submit} loading={loading} />
      <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ marginTop: 18, alignItems: 'center' }}>
        <Text style={{ color: C.ink }}>New here? Create an account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
