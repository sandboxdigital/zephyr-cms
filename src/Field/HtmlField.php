<?php
namespace SandboxDigital\Cms\Field;

class HtmlField extends AbstractField 
{
	function __construct ($xmlNode) 
	{
		parent::__construct ($xmlNode);
		
		$this->_value = (string)$xmlNode;
	}
	
	function __toString () 
	{
		return $this->_value;
	}
}
?>