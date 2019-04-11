<?php
/**
 * Created by PhpStorm.
 * User: jesign
 * Date: 4/10/19
 * Time: 12:39 PM
 */

namespace Sandbox\Cms\Content\Field;

class Media extends AbstractField
{
    function __construct($elementSpec) {
        parent::__construct ($elementSpec);
    }

    public function loadXml(\SimpleXMLElement $xmlNode): void
    {
        parent::loadXml($xmlNode);

        $this->_value = (string)$xmlNode;
    }

    function __toString ()
    {
        return $this->_value ? $this->_value->url : '';
    }

    function toString ()
    {
        return $this->__toString();
    }

    function fromPost ()
    {

    }
}