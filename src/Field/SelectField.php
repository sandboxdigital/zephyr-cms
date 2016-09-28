<?php
namespace SandboxDigital\Cms\Field;

class SelectField extends AbstractField 
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
	
	function fromPost ()
	{
		
	}
}
?>