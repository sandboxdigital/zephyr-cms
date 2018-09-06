<?php
namespace Sandbox\Cms\Content\Field;

class Text extends AbstractField
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
		return $this->_value;
	}
	
	function toString () 
	{
		return $this->__toString();
	}
	
	function fromPost ()
	{
		
	}
}