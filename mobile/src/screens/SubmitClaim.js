import React, { useState } from 'react';
import { Text, ScrollView, Alert } from 'react-native';
import api, { errMsg } from '../api';
import { Field, Button, s } from '../components';
import { C } from '../config';

// Used for both creating (params.itemId) and editing (params.claim) a claim
export default function SubmitClaim({ route, navigation }) {
  const { itemId, claim } = route.params;
  const [description, setDescription] = useState(claim?.description || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (description.trim().length < 10) return setError('Give at least 10 characters of proof, such as marks, contents or when you lost it');
    setError('');
    setLoading(true);
    try {
      claim ? await api.put(`/claims/${claim._id}`, { description }) : await api.post(`/items/${itemId}/claims`, { description });
      navigation.goBack();
    } catch (e) { Alert.alert('Could not submit claim', errMsg(e)); }
    setLoading(false);
  };

  return (
    <ScrollView style={s.screen} contentContainerStyle={{ padding: 16 }}>
      <Text style={{ color: C.muted, marginBottom: 14 }}>Describe details only the owner would know. The reporter uses this to decide.</Text>
      <Field label="Proof of ownership" value={description} onChangeText={setDescription} multiline error={error} placeholder="e.g. Cracked corner, sticker on the back, last used in lab 3" />
      <Button title={claim ? 'Save changes' : 'Submit claim'} onPress={submit} loading={loading} />
    </ScrollView>
  );
}
