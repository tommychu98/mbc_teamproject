import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import AddressSearch from '../../components/common/AddressSearch';
import { PROFILE_AVATARS } from '../../data/profileAvatars';
import { useAuthStore } from '../../store/useAuthStore';
import './ProfileEditPage.css';

const interestOptions = ['FRAGRANCES', 'CANDLES & HOME', 'BATH & BODY', 'NEW'];

function resizeProfileImage(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const source = URL.createObjectURL(file);
    image.onload = () => {
      const size = 512; const canvas = document.createElement('canvas'); const context = canvas.getContext('2d');
      canvas.width = size; canvas.height = size;
      const crop = Math.min(image.width, image.height); const x = (image.width - crop) / 2; const y = (image.height - crop) / 2;
      context.drawImage(image, x, y, crop, crop, 0, 0, size, size); URL.revokeObjectURL(source);
      const encode = (quality) => canvas.toBlob((blob) => {
        if (!blob) { reject(new Error('이미지를 처리하지 못했습니다.')); return; }
        if (blob.size > 500 * 1024 && quality > .45) { encode(quality - .12); return; }
        const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(blob);
      }, 'image/webp', quality);
      encode(.82);
    };
    image.onerror = () => { URL.revokeObjectURL(source); reject(new Error('이미지를 읽지 못했습니다.')); };
    image.src = source;
  });
}

export default function ProfileEditPage() {
  const { user, updateProfile } = useAuthStore();
  const initial = useMemo(() => ({ name: user.name, email: user.email, profileImage: user.profileImage, profileImageType: user.profileImageType || 'avatar', selectedAvatarId: user.selectedAvatarId || '', interests: user.interests || [], address: { zonecode: '', roadAddress: '', jibunAddress: '', detailAddress: '', extraAddress: '', ...user.address }, marketing: Boolean(user.marketing) }), [user]);
  const [form, setForm] = useState(initial);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dirty = JSON.stringify(form) !== JSON.stringify(initial);
  useEffect(() => { const warn = (event) => { if (dirty) event.preventDefault(); }; window.addEventListener('beforeunload', warn); return () => window.removeEventListener('beforeunload', warn); }, [dirty]);
  const selectFile = async (event) => {
    const file = event.target.files?.[0]; event.target.value = ''; if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) { setError('JPEG, PNG, WebP 파일을 5MB 이하로 선택해 주세요.'); return; }
    try { const profileImage = await resizeProfileImage(file); setForm((value) => ({ ...value, profileImage, profileImageType: 'upload', selectedAvatarId: '' })); setError(''); } catch (imageError) { setError(imageError.message); }
  };
  const selectAvatar = (avatar) => setForm((value) => ({ ...value, profileImage: avatar.src, profileImageType: 'avatar', selectedAvatarId: avatar.id }));
  const removePhoto = () => selectAvatar(PROFILE_AVATARS[0]);
  const toggleInterest = (interest) => setForm((value) => ({ ...value, interests: value.interests.includes(interest) ? value.interests.filter((item) => item !== interest) : [...value.interests, interest] }));
  const cancel = () => { if (!dirty || window.confirm('저장하지 않은 변경사항이 있습니다. 페이지를 나갈까요?')) navigate('/mypage'); };
  const save = (event) => { event.preventDefault(); if (!form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) { setError('이름과 올바른 이메일을 확인해 주세요.'); return; } updateProfile(form); navigate('/mypage', { state: { message: '프로필이 수정되었습니다.' } }); };
  return <main className="profile-edit container section"><p className="eyebrow">Profile · Information</p><h1 className="page-title">Your details</h1><form onSubmit={save}>
    <section className="profile-edit__image"><img src={form.profileImage} alt="선택한 프로필 미리보기" /><label className="button button--secondary">사진 선택<input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" onChange={selectFile} /></label><button className="button button--text" type="button" onClick={removePhoto}>사진 삭제</button>{error && <p className="field__error" role="alert">{error}</p>}</section>
    <fieldset className="profile-edit__avatars"><legend>기본 캐릭터 선택</legend><div>{PROFILE_AVATARS.map((avatar) => <button key={avatar.id} type="button" aria-label={avatar.name} aria-pressed={form.profileImage === avatar.src} onClick={() => selectAvatar(avatar)}><img src={avatar.src} alt="" />{form.profileImage === avatar.src && <Check />}</button>)}</div></fieldset>
    <div className="profile-edit__fields"><label className="field"><span className="field__label">이름</span><input className="field__input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label><label className="field"><span className="field__label">이메일</span><input className="field__input" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label></div>
    <fieldset className="profile-edit__interests"><legend>관심 카테고리</legend><div>{interestOptions.map((interest) => <label key={interest}><input type="checkbox" checked={form.interests.includes(interest)} onChange={() => toggleInterest(interest)} />{interest}</label>)}</div></fieldset>
    <AddressSearch value={form.address} onChange={(address) => setForm({ ...form, address })} />
    <label className="profile-edit__check"><input type="checkbox" checked={form.marketing} onChange={(event) => setForm({ ...form, marketing: event.target.checked })} />마케팅 정보 수신에 동의합니다.</label>
    <div className="profile-edit__actions"><button className="button button--secondary" type="button" onClick={cancel}>취소</button><button className="button" type="submit">변경사항 저장</button></div>
  </form></main>;
}
