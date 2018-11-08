<?php
/**
 * Created by PhpStorm.
 * User: jesign
 * Date: 11/6/18
 * Time: 1:04 PM
 */

namespace Sandbox\Cms\Crud\InputFields;


class Map extends AbstractInputField {


    use InputField;
    use withOptions;

    public function render($name, $data = null) {
        $data = explode(',',$data);
        $lat = 0; $lng = 0;

        if(count($data) == 2){
            $lat =(double) $data[0];
            $lng =(double) $data[1];
        }

        $nameLat = isset($this->options['name_lat']) ? $this->options['name_lat'] : 'address_lat';
        $nameLng = isset($this->options['name_lng']) ? $this->options['name_lng'] : 'address_lng';
        $zoom = isset($this->options['zoom']) ? $this->options['zoom'] : 14;

        $field = "<google-map name='$name' lat='$lat' lng='$lng' name-lat='$nameLat' name-lng='$nameLng' zoom='$zoom'></google-map>";

        return $field;
    }
}