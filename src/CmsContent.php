<?php

namespace SandboxDigital\Cms;

use \Exception;
use SandboxDigital\Cms\Field\AbstractField;
use SandboxDigital\Cms\Field\PlaceholderField;


class CmsContent
{
	private $_elements;
		
	public function __construct($dataXmlString)
	{
		$this->_elements = array ();


		// TODO move to an XML adapter
		// TODO build JSON adapter
		$xml = simplexml_load_string($dataXmlString);
		
		if ($xml instanceof \SimpleXMLElement) {
			if ($xml->children ()) {
				foreach ($xml->children () as $xmlChild) {
					$type = (string)$xmlChild->getName();
					$id = (string)$xmlChild->attributes()->id;
					$this->addElement($type, $id, $xmlChild);				
				}
			}
		}
	}
	
	public function __toString()
	{
		return '';
	}
	
	public function __get($name)
	{
		if (isset($this->_elements[$name]))
			return $this->_elements[$name];
		else
			return new PlaceholderField($name); // return a Placeholder so site doesn't fall over if content element doesn't exist
	}

	/**
	 * @param $path
	 *
	 * @return mixed|CmsContent|AbstractField
	 */

	public function get ($path)
	{
		$paths = explode('/', $path);
		
		$current = $this;
		foreach ($paths as $path)
		{
			$current = $current->__get($path);			
		}
		return $current;
	}
	
	public function hasElement ($name)
	{
		return isset($this->_elements[$name]);
	}

    public function has ($name)
    {
        return $this->hasContent($name);
    }
	
	public function hasContent ($name)
	{
		if (!isset($this->_elements[$name]))
			return false;
		else {
			return $this->_elements[$name]->hasContent ();
			
		}
	}
	
	public function addElement ($type, $id, $xml)
	{	
		$elementClassName = "SandboxDigital\\Cms\\Field\\".ucfirst($type)."Field";
		$element = new $elementClassName ($xml);		
		$this->_elements[$id] = $element;
	}	
	
	public function render ($contentPathId)
	{
		$lang = Tg_Site::language();
		
		if (!empty($lang))
			$contentPath = $lang.'/'.$contentPathId;
		else		
			$contentPath = $contentPathId;
		
		// TODO - rewrite to use a 'content stack' an array of content paths to try, 
		// loop over paths and test to see if they have content.
			
		$content = Tg_Site::getInstance()->getCurrentPage()->getContent();			
		$element = $content->getElement($contentPath);
		
		if ($element instanceof Tg_Content_Placeholder || $element instanceof Tg_Content_Element_Group && count($element)==0)
		{	
			// element is empty ... check template for default content
			$templateContent = Tg_Site::getInstance()->getCurrentPage()->getTemplate()->getContent();			
			$element = $templateContent->getElement($contentPath);
			
			if ($element instanceof Tg_Content_Placeholder || ($element instanceof Tg_Content_Element_Group && count($element)==0))
			{
				// template content empty ... default to english
				if (!empty($lang))
					$contentPath = 'en/'.$contentPathId;
					
				$element = $content->getElement($contentPath);
				if ($element instanceof Tg_Content_Placeholder || ($element instanceof Tg_Content_Element_Group && count($element)==0))
				{
					$element = $templateContent->getElement($contentPath);
					echo $this->view->contentPartial ($element);
				}
				else
					echo $this->view->contentPartial ($element);
			}
			else
				echo $this->view->contentPartial ($element);	
		} else 
			echo $this->view->contentPartial ($element);		
	}

	public function toJson ()
	{
		$jsonElements = array ();
		foreach ($this->_elements as $key=>$value)
		{
			$j = $this->_elements[$key]->toJson ();
			array_push($jsonElements,$key.':'.$j);
		}

		return '{'.implode(',',$jsonElements).'}';
	}
}