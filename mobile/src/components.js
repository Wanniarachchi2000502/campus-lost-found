import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { BASE_URL, C } from './config';

export const Field = ({ label, error, ...props }) => (
  <View style={{ marginBottom: 14 }}>
    {label ? <Text style={s.label}>{label}</Text> : null}
    <TextInput placeholderTextColor="#98A2AB" style={[s.input, error && { borderColor: C.danger }, props.multiline && { height: 100, textAlignVertical: 'top' }]} {...props} />
    {error ? <Text style={s.err}>{error}</Text> : null}
  </View>
);

export const Button = ({ title, onPress, loading, kind = 'primary', style }) => {
  const bg = kind === 'primary' ? C.ink : kind === 'danger' ? C.danger : kind === 'ok' ? C.found : 'transparent';
  const fg = kind === 'ghost' ? C.ink : '#fff';
  return (
    <TouchableOpacity onPress={onPress} disabled={loading} activeOpacity={0.8}
      style={[s.btn, { backgroundColor: bg }, kind === 'ghost' && { borderWidth: 1, borderColor: C.line }, style]}>
      {loading ? <ActivityIndicator color={fg} /> : <Text style={[s.btnText, { color: fg }]}>{title}</Text>}
    </TouchableOpacity>
  );
};

export const Loading = () => <View style={s.center}><ActivityIndicator size="large" color={C.ink} /></View>;

export const Empty = ({ title, hint }) => (
  <View style={s.center}>
    <Text style={{ fontSize: 17, fontWeight: '700', color: C.ink }}>{title}</Text>
    {hint ? <Text style={{ color: C.muted, marginTop: 6, textAlign: 'center' }}>{hint}</Text> : null}
  </View>
);

export const ErrorBox = ({ message, onRetry }) => (
  <View style={s.center}>
    <Text style={{ color: C.danger, textAlign: 'center', marginBottom: 12 }}>{message}</Text>
    {onRetry ? <Button title="Try again" kind="ghost" onPress={onRetry} /> : null}
  </View>
);

const STATUS = { Open: C.found, Claimed: C.warn, Returned: C.muted, Pending: C.warn, Approved: C.found, Rejected: C.danger };
export const Badge = ({ text, color }) => (
  <View style={[s.badge, { backgroundColor: (color || STATUS[text] || C.muted) + '1F' }]}>
    <Text style={{ color: color || STATUS[text] || C.muted, fontWeight: '700', fontSize: 12 }}>{text}</Text>
  </View>
);

export const imageUri = (img) => (img ? `${BASE_URL}${img}` : null);

export const ItemCard = ({ item, onPress, children }) => (
  <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={s.card}>
    <View style={[s.stripe, { backgroundColor: item.type === 'lost' ? C.lost : C.found }]} />
    {item.image ? <Image source={{ uri: imageUri(item.image) }} style={s.thumb} /> : <View style={[s.thumb, s.noImg]}><Text style={{ color: C.muted, fontSize: 11 }}>No image</Text></View>}
    <View style={{ flex: 1, padding: 10 }}>
      <Text style={s.title} numberOfLines={1}>{item.title}</Text>
      <Text style={{ color: C.muted, marginTop: 2 }} numberOfLines={1}>{item.category} - {item.location}</Text>
      <View style={{ flexDirection: 'row', marginTop: 6, alignItems: 'center' }}>
        <Badge text={item.type === 'lost' ? 'Lost' : 'Found'} color={item.type === 'lost' ? C.lost : C.found} />
        <View style={{ width: 6 }} />
        <Badge text={item.status} />
      </View>
      {children}
    </View>
  </TouchableOpacity>
);

export const s = StyleSheet.create({
  label: { fontWeight: '600', color: C.ink, marginBottom: 6 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 11, fontSize: 15, color: C.ink },
  err: { color: C.danger, marginTop: 4, fontSize: 12 },
  btn: { paddingVertical: 13, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontWeight: '700', fontSize: 15 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10, marginBottom: 10, overflow: 'hidden', borderWidth: 1, borderColor: C.line },
  stripe: { width: 5 },
  thumb: { width: 84, height: 84, margin: 10, borderRadius: 8 },
  noImg: { backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: '700', color: C.ink },
  screen: { flex: 1, backgroundColor: C.bg },
});
