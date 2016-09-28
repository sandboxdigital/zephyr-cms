<?php
namespace SandboxDigital\Cms\Field;

class FileField extends AbstractField 
{	
	function __construct ($xmlNode) 
	{
		parent::__construct ($xmlNode);
		
		$this->_value = (string)$xmlNode->attributes()->fileUrl;
	}
	
	function __toString()
	{		
		//$file = Tg_File::getFile ($this->_value);
		
//		if ($file)
//			return $file->getUrl();
//		else
			return $this->_value;
	}

	public function toJson ()
	{
		$f = $this->getFile();
		$url = $f!=null?$f->getUrl():'';
		return '{"type":"'.$this->_type.'","id":"'.$this->_id.'","uid":"'.$this->_uid.'","label":"'.$this->_label.'","value":"'.$this->_value.'","url":"'.$url.'"}';
	}
	
	function getFile () 
	{
		return null;
	}
}