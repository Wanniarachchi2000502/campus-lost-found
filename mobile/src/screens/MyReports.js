import React from 'react';
import { View, FlatList, Alert, RefreshControl } from 'react-native';
import api, { errMsg } from '../api';
import useLoad from '../useLoad';
import { ItemCard, Button, Loading, Empty, ErrorBox, s } from '../components';

export default function MyReports({ navigation }) {
  const { data, loading, error, reload } = useLoad(async () => (await api.get('/items/mine')).data);

  const remove = (item) =>
    Alert.alert('Delete this report?', item.title, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try { await api.delete(`/items/${item._id}`); reload(); } catch (e) { Alert.alert('Could not delete', errMsg(e)); }
      } },
    ]);

  if (loading && !data) return <Loading />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;
  return (
    <View style={s.screen}>
      <FlatList
        data={data} keyExtractor={(i) => i._id} contentContainerStyle={{ padding: 12, flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={false} onRefresh={reload} />}
        ListEmptyComponent={<Empty title="You have not reported anything" hint="Use Report item on the Browse tab." />}
        renderItem={({ item }) => (
          <ItemCard item={item} onPress={() => navigation.navigate('ItemDetails', { id: item._id })}>
            <View style={{ flexDirection: 'row', marginTop: 8 }}>
              <Button title="Edit" kind="ghost" style={{ paddingVertical: 6, paddingHorizontal: 14 }} onPress={() => navigation.navigate('ReportItem', { item })} />
              <View style={{ width: 8 }} />
              <Button title="Delete" kind="danger" style={{ paddingVertical: 6, paddingHorizontal: 14 }} onPress={() => remove(item)} />
            </View>
          </ItemCard>
        )}
      />
    </View>
  );
}
