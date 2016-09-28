<?php
namespace SandboxDigital\Cms\Field;

class GroupOptionField extends AbstractField
{
	private $_elements;
	
	function __construct(\SimpleXMLElement $xmlNode) {
		parent::__construct ($xmlNode);
		
		$this->_elements = array ();
		
		if ($xmlNode->children ()) {
			foreach ($xmlNode->children () as $xmlField) {
				$id = (string)$xmlField->attributes()->id;
				$type = (string)$xmlField->getName();				
				
				$this->addElement ($type, $id, $xmlField);
			}
		}
	}
	
	function __get($name)
	{
		if ($name == 'type')
			return $this->_type;
		elseif ($name == 'id')
			return $this->_id;
		elseif (isset($this->_elements[$name]))
			return $this->_elements[$name];
		else
			return parent::__get($name);
	}
	
	function __toString()
	{
		return 'GroupOption does not return a string. <br />Try accessing a child: '.implode (',',array_keys($this->_elements));
	}

	public function toJson ()
	{
		$jsonElements = array ();
		foreach ($this->_elements as $key=>$value)
		{
			$j = $this->_elements[$key]->toJson ();
			array_push($jsonElements,$key.':'.$j);
		}

		$jA = implode(',',$jsonElements);

		return '{"type":"'.$this->_type.'","id":"'.$this->_id.'","uid":"'.$this->_uid.'","label":"'.$this->_label.'","elements":{'.implode(',',$jsonElements).'}}';
	}
	
	public function addElement ($type, $id, $xml)
	{
		// TODO - move to adapter
        $elementClassName = "SandboxDigital\\Cms\\Field\\".ucfirst($type)."Field";
        $element = new $elementClassName ($xml);

        $this->_elements[$id] = $element;
	}
	
	public function get ($id)
	{
		if (array_key_exists($id, $this->_elements)) {
            return $this->_elements[$id];
        }
        return null;
	}
}
?>