<?php
namespace Sandbox\Content\Field;

class File extends AbstractField
{
    private $_files = [];

    function __construct($elementSpec) {
        parent::__construct ($elementSpec);
    }

	function __toString()
	{
	    $file = $this->getFile();

	    if ($file)
        {
            return $file->url;
        } else {
	        return 'No file';
        }
	}

	function hasFile()
	{
	    $file = $this->getFile();

	    return $file ? true : false;
	}

    public function loadJson($json)
    {
       parent::loadJson($json);

        $this->_files = $json->files;
    }

	public function toJson ()
	{
		$f = $this->getFile();
		$url = $f ? $f->getUrl():'';
		return '{"type":"'.$this->_type.'","id":"'.$this->_id.'","uid":"'.$this->_uid.'","label":"'.$this->_label.'","value":"'.$this->_value.'","url":"'.$url.'"}';
	}
	
	function getFile () 
	{
	    if (count($this->_files) && isset($this->_files[0]->url)) {
            return $this->_files[0];
        }

		return null;
	}
}