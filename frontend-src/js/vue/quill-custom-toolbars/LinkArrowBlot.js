import Quill from 'quill'
let Link = Quill.import('formats/link');

class LinkArrowBlot extends Link {}
LinkArrowBlot.blotName = 'link-arrow';
LinkArrowBlot.tagName = 'link-arrow';


export default LinkArrowBlot;