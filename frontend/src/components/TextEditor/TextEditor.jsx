import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Custom styles for the editor
const editorStyles = `
  .ql-toolbar {
    border-radius: 8px 8px 0 0;
    border: 1px solid #E5E7EB;
    border-bottom: none;
    background-color: #F9FAFB;
  }
  
  .ql-container {
    border-radius: 0 0 8px 8px;
    border: 1px solid #E5E7EB !important;
    font-family: inherit;
    font-size: 14px;
    min-height: 200px;
  }
  
  .ql-editor {
    min-height: 200px;
  }
  
  .ql-editor.ql-blank::before {
    color: #9CA3AF;
    font-style: normal;
    left: 16px;
  }
  
  .ql-snow .ql-stroke {
    stroke: #4B5563;
  }
  
  .ql-snow .ql-fill {
    fill: #4B5563;
  }
  
  .ql-snow .ql-picker-label {
    color: #4B5563;
  }
  
  .ql-snow .ql-picker-options {
    border-radius: 6px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  
  .ql-snow .ql-tooltip {
    border-radius: 6px;
    border: 1px solid #E5E7EB;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
`;

// Add the styles to the document head
const styleElement = document.createElement('style');
styleElement.innerHTML = editorStyles;
document.head.appendChild(styleElement);

// Custom toolbar configuration
const modules = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ 'list': 'bullet' }],
  ],
};

const formats = [
  'bold', 'italic', 'underline', 'list'
];

const TextEditor = ({ value, onChange, placeholder }) => {
  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || "Write something..."}
      />
    </div>
  );
};

export default TextEditor;

TextEditor.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};
