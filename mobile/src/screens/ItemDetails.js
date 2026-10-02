import React, { useState } from 'react';
import { View, Text, ScrollView, Image, Alert } from 'react-native';
import api, { errMsg } from '../api';
import useLoad from '../useLoad';
import { useAuth } from '../AuthContext';
import { Button, Badge, Loading, ErrorBox, imageUri, s } from '../components';
import { C } from '../config';

const Row = ({ k, v }) => (
  <View style={{ flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderColor: C.line }}>
    <Text style={{ width: 100, color: C.muted }}>{k}</Text>
    <Text style={{ flex: 1, color: C.ink }}>{v}</Text>
  </View>
);

export default function ItemDetails({ route, navigation }) {
  const { id } = route.params;
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const { data: item, loading, error, reload } = useLoad(async () => (await api.get(`/items/${id}`)).data, [id]);

  if (loading && !item) return <Loading />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;

  const isOwner = item.userId._id === user.id;
  const canClaim = !isOwner && item.type === 'found' && item.status !== 'Returned' && !item.myClaim;

  const remove = () =>
    Alert.alert('Delete this report?', 'Claims on this item will also be deleted.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        setBusy(true);
        try { await api.delete(`/items/${id}`); navigation.goBack(); } catch (e) { Alert.alert('Could not delete', errMsg(e)); }
        setBusy(false);
      } },
    ]);

  return (
    <ScrollView style={s.screen} contentContainerStyle={{ padding: 16 }}>
      {item.image ? <Image source={{ uri: imageUri(item.image) }} style={{ width: '100%', height: 220, borderRadius: 10, marginBottom: 14 }} resizeMode="cover" /> : null}
      <Text style={{ fontSize: 22, fontWeight: '800', color: C.ink }}>{item.title}</Text>
      <View style={{ flexDirection: 'row', marginVertical: 10 }}>
        <Badge text={item.type === 'lost' ? 'Lost' : 'Found'} color={item.type === 'lost' ? C.lost : C.found} />
        <View style={{ width: 6 }} />
        <Badge text={item.status} />
      </View>
      <Text style={{ color: C.ink, lineHeight: 21, marginBottom: 10 }}>{item.description}</Text>
      <Row k="Category" v={item.category} />
      <Row k="Location" v={item.location} />
      <Row k="Date" v={new Date(item.date).toDateString()} />
      <Row k="Reported by" v={item.userId.name} />
      <View style={{ height: 18 }} />

      {item.myClaim ? <Text style={{ color: C.muted, marginBottom: 10 }}>Your claim: {item.myClaim.status}. See "My claims" for details.</Text> : null}
      {canClaim ? <Button title="Claim this item" onPress={() => navigation.navigate('SubmitClaim', { itemId: id })} /> : null}
      {isOwner ? (
        <>
          {item.type === 'found' ? <Button title="Manage claims" onPress={() => navigation.navigate('ManageClaims', { itemId: id })} /> : null}
          <Button title="Edit report" kind="ghost" style={{ marginTop: 10 }} onPress={() => navigation.navigate('ReportItem', { item })} />
          <Button title="Delete report" kind="danger" loading={busy} style={{ marginTop: 10 }} onPress={remove} />
        </>
      ) : null}
    </ScrollView>
  );
}
