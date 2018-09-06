<?php

namespace Sandbox\Cms\Crud\InputFields;

class Image extends AbstractInputField  {

    use InputField;
    use withOptions;

    public function render($name, $data = null) {
        $template = '';
        if($data){
            if(strpos($data, 'http')){
                $source = $data;
            }

            if(isset($this->options['root'])){
                $source = $this->options['root'] . $data;
            }else {
                $source = $data;
            }
            $height = '200px';
            if(isset($this->options['height'])){
                $height = $this->options['height'];
            }

            $template = "<br><img src='$source' class='img-thumbnail mb-2' style='height:$height;'>";
        }


        $template .= "<input name='$name' type='file' class='form-control-file'>";
        return $template;
    }
}