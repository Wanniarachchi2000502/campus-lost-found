import React, { useState } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import api, { errMsg } from '../api';
import useLoad from '../useLoad';
import { Badge, Button, Loading, Empty, ErrorBox, s } from '../components';
import { C } from '../config';

export default function ManageClaims({ route }) {
  const { itemId } = route.params;
  const [busyId, setBusyId] = useState(null);
  const { data, loading, error, reload } = useLoad(async () => (await api.get(`/items/${itemId}/claims`)).data, [itemId]);

  const decide = (claim, status) => {
    const go = async () => {
      setBusyId(claim._id);
      try { await api.patch(`/claims/${claim._id}/status`, { status }); await reload(); } catch (e) { Alert.alert('Action failed', errMsg(e)); }
      setBusyId(null);
    };
    status === 'Approved'
      ? Alert.alert('Approve this claim?', 'The item will be marked Returned and other pending claims will be rejected.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Approve', onPress: go }])
      : go();
  };

  if (loading && !data) return <Loading />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;
  return (
    <View style={s.screen}>
      <FlatList
        data={data} keyExtractor={(c) => c._id} contentContainerStyle={{ padding: 12, flexGrow: 1 }}
        ListEmptyComponent={<Empty title="No claims yet" hint="Claims from other students will show up here." />}
        renderItem={({ item: c }) => (
          <View style={[s.card, { padding: 12, flexDirection: 'column' }]}>
            <Text style={s.title}>{c.userId.name}</Text>
            <Text style={{ color: C.muted }}>{c.userId.email}</Text>
            <Text style={{ color: C.ink, marginVertical: 8 }}>{c.description}</Text>
            <Badge text={c.status} />
            {c.status === 'Pending' ? (
              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <Button title="Approve" kind="ok" loading={busyId === c._id} style={{ paddingVertical: 8, paddingHorizontal: 16, marginRight: 8 }} onPress={() => decide(c, 'Approved')} />
                <Button title="Reject" kind="ghost" style={{ paddingVertical: 8, paddingHorizontal: 16 }} onPress={() => decide(c, 'Rejected')} />
              </View>
            ) : null}
          </View>
        )}
      />
    </View>
  );
}
