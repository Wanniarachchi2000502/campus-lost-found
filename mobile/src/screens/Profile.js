import React from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '../AuthContext';
import { Button, s } from '../components';
import { C } from '../config';

export default function Profile() {
  const { user, logout } = useAuth();
  return (
    <View style={[s.screen, { padding: 20 }]}>
      <Text style={{ fontSize: 22, fontWeight: '800', color: C.ink }}>{user.name}</Text>
      <Text style={{ color: C.muted, marginTop: 4, marginBottom: 28 }}>{user.email}</Text>
      <Button title="Log out" kind="danger" onPress={logout} />
    </View>
  );
}
