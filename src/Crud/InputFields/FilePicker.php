<?php
/**
 * Created by PhpStorm.
 * User: jesign
 * Date: 5/10/19
 * Time: 7:57 AM
 */

namespace Sandbox\Cms\Crud\InputFields;

class FilePicker extends AbstractInputField
{
    use InputField;

    public function render($name, $data = null) {
        return "<file-picker name='$name' initial-value='$data'></file-picker>";
    }

}