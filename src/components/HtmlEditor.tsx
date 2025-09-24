import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
};

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'blockquote', 'code-block'],
    ['clean']
  ]
};

export default function HtmlEditor({ value, onChange, placeholder, minHeight = 180 }: Props) {
  return (
    <div style={{ minHeight }}>
      <ReactQuill theme="snow" value={value || ''} onChange={onChange} placeholder={placeholder} modules={modules} />
    </div>
  );
}
