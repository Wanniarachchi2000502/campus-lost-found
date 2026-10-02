import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import api, { errMsg } from '../api';
import { Field, Button, imageUri, s } from '../components';
import { C, CATEGORIES } from '../config';

const chip = (on, color = C.ink) => ({ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, marginRight: 8, marginBottom: 8, borderWidth: 1, borderColor: on ? color : C.line, backgroundColor: on ? color : '#fff' });

export default function ReportItem({ route, navigation }) {
  const editing = route.params?.item;
  const [f, setF] = useState({
    type: editing?.type || 'lost', title: editing?.title || '', description: editing?.description || '',
    category: editing?.category || '', location: editing?.location || '',
    date: (editing?.date ? new Date(editing.date) : new Date()).toISOString().slice(0, 10),
  });
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const set = (k) => (v) => setF({ ...f, [k]: v });

  const pick = async () => {
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.6 });
    if (!r.canceled) setImage(r.assets[0]);
  };

  const submit = async () => {
    const e = {};
    if (!f.title.trim()) e.title = 'Enter a title';
    if (!f.description.trim()) e.description = 'Describe the item';
    if (!f.category) e.category = 'Choose a category';
    if (!f.location.trim()) e.location = 'Enter where it was lost or found';
    if (isNaN(Date.parse(f.date))) e.date = 'Use the format YYYY-MM-DD';
    setErrors(e);
    if (Object.keys(e).length) return;

    const body = new FormData();
    Object.entries(f).forEach(([k, v]) => body.append(k, v));
    if (image) body.append('image', { uri: image.uri, name: image.fileName || 'item.jpg', type: image.mimeType || 'image/jpeg' });
    setLoading(true);
    try {
      const cfg = { headers: { 'Content-Type': 'multipart/form-data' } };
      editing ? await api.put(`/items/${editing._id}`, body, cfg) : await api.post('/items', body, cfg);
      navigation.goBack();
    } catch (err) { Alert.alert('Could not save report', errMsg(err)); }
    setLoading(false);
  };

  const preview = image?.uri || imageUri(editing?.image);
  return (
    <ScrollView style={s.screen} contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
      <Text style={s.label}>This item was</Text>
      <View style={{ flexDirection: 'row', marginBottom: 6 }}>
        <TouchableOpacity style={chip(f.type === 'lost', C.lost)} onPress={() => set('type')('lost')}><Text style={{ color: f.type === 'lost' ? '#fff' : C.ink, fontWeight: '600' }}>Lost by me</Text></TouchableOpacity>
        <TouchableOpacity style={chip(f.type === 'found', C.found)} onPress={() => set('type')('found')}><Text style={{ color: f.type === 'found' ? '#fff' : C.ink, fontWeight: '600' }}>Found by me</Text></TouchableOpacity>
      </View>
      <Field label="Title" value={f.title} onChangeText={set('title')} placeholder="e.g. Blue student ID card" error={errors.title} />
      <Field label="Description" value={f.description} onChangeText={set('description')} multiline placeholder="Colour, brand, markings, contents" error={errors.description} />
      <Text style={s.label}>Category</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {CATEGORIES.map((c) => (
          <TouchableOpacity key={c} style={chip(f.category === c)} onPress={() => set('category')(c)}>
            <Text style={{ color: f.category === c ? '#fff' : C.ink }}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {errors.category ? <Text style={[s.err, { marginBottom: 10 }]}>{errors.category}</Text> : null}
      <Field label="Location" value={f.location} onChangeText={set('location')} placeholder="e.g. Library, 2nd floor" error={errors.location} />
      <Field label="Date (YYYY-MM-DD)" value={f.date} onChangeText={set('date')} error={errors.date} />
      {preview ? <Image source={{ uri: preview }} style={{ width: '100%', height: 180, borderRadius: 10, marginBottom: 10 }} /> : null}
      <Button title={preview ? 'Change image' : 'Add image'} kind="ghost" onPress={pick} style={{ marginBottom: 14 }} />
      <Button title={editing ? 'Save changes' : 'Submit report'} onPress={submit} loading={loading} />
    </ScrollView>
  );
}
