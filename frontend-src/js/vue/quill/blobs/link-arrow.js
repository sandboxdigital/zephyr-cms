import Quill from 'quill'
let Link = Quill.import('formats/link');

class LinkArrow extends Link {}
LinkArrow.blotName = 'link-arrow';
LinkArrow.tagName = 'link-arrow';


export default LinkArrow;