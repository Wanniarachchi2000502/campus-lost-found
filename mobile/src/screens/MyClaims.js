import React from 'react';
import { View, Text, FlatList, Alert, RefreshControl, TouchableOpacity } from 'react-native';
import api, { errMsg } from '../api';
import useLoad from '../useLoad';
import { Badge, Button, Loading, Empty, ErrorBox, s } from '../components';
import { C } from '../config';

export default function MyClaims({ navigation }) {
  const { data, loading, error, reload } = useLoad(async () => (await api.get('/claims/mine')).data);

  const remove = (claim) =>
    Alert.alert('Delete this claim?', undefined, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try { await api.delete(`/claims/${claim._id}`); reload(); } catch (e) { Alert.alert('Could not delete', errMsg(e)); }
      } },
    ]);

  if (loading && !data) return <Loading />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;
  return (
    <View style={s.screen}>
      <FlatList
        data={data} keyExtractor={(c) => c._id} contentContainerStyle={{ padding: 12, flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={false} onRefresh={reload} />}
        ListEmptyComponent={<Empty title="No claims yet" hint="Open a found item and choose Claim this item." />}
        renderItem={({ item: c }) => (
          <View style={[s.card, { padding: 12, flexDirection: 'column' }]}>
            <TouchableOpacity disabled={!c.itemId} onPress={() => navigation.navigate('ItemDetails', { id: c.itemId._id })}>
              <Text style={s.title}>{c.itemId?.title || 'Item removed'}</Text>
            </TouchableOpacity>
            <Text style={{ color: C.muted, marginVertical: 6 }}>{c.description}</Text>
            <Badge text={c.status} />
            {c.status === 'Approved' ? <Text style={{ color: C.found, marginTop: 6 }}>Approved. Contact the reporter to collect your item.</Text> : null}
            {c.status !== 'Approved' ? (
              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                {c.status === 'Pending' ? <Button title="Edit" kind="ghost" style={{ paddingVertical: 6, paddingHorizontal: 14, marginRight: 8 }} onPress={() => navigation.navigate('SubmitClaim', { claim: c })} /> : null}
                <Button title="Delete" kind="danger" style={{ paddingVertical: 6, paddingHorizontal: 14 }} onPress={() => remove(c)} />
              </View>
            ) : null}
          </View>
        )}
      />
    </View>
  );
}
