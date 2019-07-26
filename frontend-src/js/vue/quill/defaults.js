
import Quill from 'quill';
import LinkArrowBlot from  './blobs/link-arrow';

Quill.register(LinkArrowBlot);

let icons = Quill.import('ui/icons');
icons['link-arrow'] = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M 12 2 C 6.477 2 2 6.477 2 12 C 2 17.523 6.477 22 12 22 C 17.523 22 22 17.523 22 12 C 22 6.477 17.523 2 12 2 z M 12 4 C 16.418 4 20 7.582 20 12 C 20 16.418 16.418 20 12 20 C 7.582 20 4 16.418 4 12 C 4 7.582 7.582 4 12 4 z M 11 6.9296875 L 9.5 8.4296875 L 13.070312 12 L 9.5 15.570312 L 11 17.070312 L 16.070312 12 L 11 6.9296875 z"></path> </svg>';

let defaultOptions = {
    modules: {
        toolbar: {
            container: [
                ['bold', 'italic', 'underline','blockquote'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' },{ 'align': [] }],
                ['clean','link', 'link-arrow'],
                [{ 'size': ['small', false, 'large', 'huge'] }],
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'align': [] }],
                ['image']
            ],
            handlers: {
                'link-arrow' : function(value){
                    if (value === true) {
                        value = prompt('Enter link URL:'); // eslint-disable-line no-alert
                    }
                    this.quill.format('link-arrow', value, Quill.sources.USER);
                }
            }
        }

    },
    placeholder: 'Compose something epic...',
    theme: 'snow'  // or 'bubble'
};

export default defaultOptions;
