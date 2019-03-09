<?php
/**
 * Created by PhpStorm.
 * User: jesign
 * Date: 10/24/18
 * Time: 1:22 PM
 */

namespace Sandbox\Cms\Crud\InputFields;

class RichEditor extends AbstractInputField
{
    use InputField;

    public function render($name, $data = null) {
        return "<ssr-editor name='$name'>$data</ssr-editor>";
        //$data = htmlentities($data);
        //return "<ssr-editor name=\"$name\" initial-content=\"$data\"></ssr-editor>";
    }
}