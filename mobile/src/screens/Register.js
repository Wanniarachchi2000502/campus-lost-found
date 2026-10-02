import React, { useState } from 'react';
import { Text, ScrollView } from 'react-native';
import { Field, Button, s } from '../components';
import { useAuth } from '../AuthContext';
import { errMsg } from '../api';

export default function Register() {
  const { register } = useAuth();
  const [f, setF] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const set = (k) => (v) => setF({ ...f, [k]: v });

  const submit = async () => {
    const e = {};
    if (f.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Enter a valid email address';
    if (f.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (f.confirm !== f.password) e.confirm = 'Passwords do not match';
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    try { await register(f.name.trim(), f.email.trim(), f.password); } catch (err) { setErrors({ form: errMsg(err) }); }
    setLoading(false);
  };

  return (
    <ScrollView style={s.screen} contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
      <Field label="Full name" value={f.name} onChangeText={set('name')} error={errors.name} />
      <Field label="University email" value={f.email} onChangeText={set('email')} autoCapitalize="none" keyboardType="email-address" error={errors.email} />
      <Field label="Password" value={f.password} onChangeText={set('password')} secureTextEntry error={errors.password} />
      <Field label="Confirm password" value={f.confirm} onChangeText={set('confirm')} secureTextEntry error={errors.confirm} />
      {errors.form ? <Text style={[s.err, { marginBottom: 10 }]}>{errors.form}</Text> : null}
      <Button title="Create account" onPress={submit} loading={loading} />
    </ScrollView>
  );
}
