<?php
namespace SandboxDigital\Cms\Field;

class AbstractField {
	protected $_type;
	protected $_id;
	protected $_uid;
	protected $_label;
	protected $_xmlNode;
	protected $_value = "blank";
	
	function __construct(\SimpleXMLElement $XMLNode=null) {
		
		$this->_xmlNode = $XMLNode;
		
		$this->_type = (string)$XMLNode->getName();
		$this->_id = (string)$XMLNode->attributes()->id;
		$this->_uid = (string)$XMLNode->attributes()->uid;
		$this->_label = isset($XMLNode->attributes()->label)?(string)$XMLNode->attributes()->label:ucfirst((string)$XMLNode->attributes()->id);
	
	}
	
	function __get ($name)
	{
		if ($name == 'label')
			return $this->_label;
		elseif ($name == 'id')
			return $this->_id;
		elseif ($name == 'uid')
			return $this->_uid;
		elseif ($name == 'type')
			return $this->_type;
		else
			return isset($this->_xmlNode->attributes()->$name) ? $this->_xmlNode->attributes()->$name->__toString() : '';
	}
	
	function getXmlAttribute ($name)
	{
		return $this->_xmlNode->attributes()->$name;
	}
	
	public function hasContent ()
	{
		if (!empty($this->_value) && $this->_value != "blank")
			return true;
		else 
			return false;
	}

	public function toJson ()
	{
		return '{"type":"'.$this->_type.'","id":"'.$this->_id.'","uid":"'.$this->_uid.'","label":"'.$this->_label.'","value":"'.$this->_value.'"}';
	}
}
?>