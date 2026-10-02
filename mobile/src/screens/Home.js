import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, RefreshControl } from 'react-native';
import api from '../api';
import useLoad from '../useLoad';
import { ItemCard, Loading, Empty, ErrorBox, s } from '../components';
import { C } from '../config';

const TYPES = [['', 'All'], ['lost', 'Lost'], ['found', 'Found']];

export default function Home({ navigation }) {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const { data, loading, error, reload } = useLoad(
    async () => (await api.get('/items', { params: { search, type } })).data,
    [search, type]
  );

  return (
    <View style={s.screen}>
      <View style={{ padding: 12, paddingBottom: 4 }}>
        <TextInput value={search} onChangeText={setSearch} placeholder="Search title, description or location" placeholderTextColor="#98A2AB" style={s.input} />
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          {TYPES.map(([v, l]) => (
            <TouchableOpacity key={l} onPress={() => setType(v)} style={{ paddingHorizontal: 16, paddingVertical: 7, borderRadius: 16, marginRight: 8, backgroundColor: type === v ? C.ink : '#fff', borderWidth: 1, borderColor: C.line }}>
              <Text style={{ color: type === v ? '#fff' : C.ink, fontWeight: '600' }}>{l}</Text>
            </TouchableOpacity>
          ))}
          <View style={{ flex: 1 }} />
          <TouchableOpacity onPress={() => navigation.navigate('ReportItem')} style={{ paddingHorizontal: 14, paddingVertical: 7, borderRadius: 16, backgroundColor: C.found }}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>Report item</Text>
          </TouchableOpacity>
        </View>
      </View>
      {loading && !data ? <Loading /> : error ? <ErrorBox message={error} onRetry={reload} /> : (
        <FlatList
          data={data} keyExtractor={(i) => i._id} contentContainerStyle={{ padding: 12, flexGrow: 1 }}
          refreshControl={<RefreshControl refreshing={false} onRefresh={reload} />}
          ListEmptyComponent={<Empty title="No items found" hint="Try a different search, or report an item yourself." />}
          renderItem={({ item }) => <ItemCard item={item} onPress={() => navigation.navigate('ItemDetails', { id: item._id })} />}
        />
      )}
    </View>
  );
}
