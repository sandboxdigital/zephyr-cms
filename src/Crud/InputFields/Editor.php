<?php
/**
 * Created by PhpStorm.
 * User: jesign
 * Date: 7/27/18
 * Time: 11:46 PM
 */

namespace Sandbox\Cms\Crud\InputFields;


class Editor extends AbstractInputField
{
    use InputField;

    public function render($name, $data = null) {
        return "<quill-field name='$name' class='mb-4'>$data</quill-field>";
//        <textarea name='$name' type='text' class='form-control bg-white' rows='5'>$data</textarea>
    }
}