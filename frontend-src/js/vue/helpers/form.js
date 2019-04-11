import CmsFieldText from '../fields/field-text.vue'
import CmsFieldHtml from '../fields/field-html.vue'
import CmsFieldFile from '../fields/field-file.vue'
import CmsFieldTextarea from '../fields/field-textarea.vue'
import CmsFieldGroup from '../fields/field-group.vue'
import CmsSelect from '../fields/field-select.vue'
import CmsMedia from '../fields/field-media.vue'

let componentTypes = {
    'text': CmsFieldText,
    'file': CmsFieldFile,
    'textarea': CmsFieldTextarea,
    'group': CmsFieldGroup,
    'html': CmsFieldHtml,
    'select': CmsSelect,
    'media': CmsMedia,
};

const form = {

    getFieldComponent (type) {
        if (componentTypes[type]) {
            return componentTypes[type];
        } else {
            console.warn('CMS component for field type `'+type+'` not found')
        }

        return null;

    },
};

export default form;