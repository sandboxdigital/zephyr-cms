<?php
namespace SandboxDigital\Cms\Field;

class DateField extends AbstractField
{	
	
	function __construct(\SimpleXMLElement $xmlNode)
	{
		parent::__construct ($xmlNode);
		
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

    function toDate ()
    {
        return new Zend_Date(strtotime($this->_value));
    }
	
	function fromPost ()
	{
		
	}
}
?>