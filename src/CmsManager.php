<?php

namespace SandboxDigital\Cms;

use \Exception;


class CmsManager
{

	public function renderAssets ()
	{
	    // TODO move to conf
		$path = '/src/sandbox-cms/frontend/';
		$path = '/skin/adminhtml/default/default/sandbox/frontend/';

		$html = '<script src="'.$path.'js/jquery.js"></script>';
		$html .= '<script>$.noConflict()</script>';
		$html .= '<script src="'.$path.'js/jquery.ui.js"></script>';
		$html .= '<script src="'.$path.'js/cms.js"></script>';
		$html .= '<link rel="stylesheet" href="'.$path.'css/cms.css" />';

		return $html;
	}

	public function getForm($options = array ())
	{
		if (empty($options['formXml']) && empty($options['formFile'])) {
            return 'Please define formXml or formFile options';
        }
        if (!isset($options['dataXml']) && !isset($options['dataFile'])) {
            return 'Please define dataXml or dataFile options';
        }

        $formXml = '';

        if (isset($options['formFile'])) {
            $formXml = $this->getFormSpecFromFile($options['formFile']);
            unset($options['formFile']);
        } else {
            $formXml = $this->getFormSpec($options['formXml']);
        }


        $dataXml = $this->getFormContent($options['dataXml']) ;
        unset($options['dataXml']);


		$output ='

<script>
jQuery(document).ready (function () {
    var formOptions = '.$this->getFormOptions($options).';
    window.form = new SandboxCMS.Form (formOptions);
    form.load (\''.$formXml.'\');
    //form.populate (\''.$dataXml.'\');
});
</script>';

		return $output;
	}

    /**
     * @param $options
     * @return mixed
     */
    public function getFormOptions($options)
    {
        if (empty($options['container'])) {
            $options['container'] = '#formContainer';
        }

        $options['subform'] = true;
        $options['adapter'] = 'xml';
        return json_encode($options);
    }

    /**
     * @param $dataXml
     * @return mixed|string
     */
    public function getFormContent($dataXml, $type = 'xml')
    {
        if (empty($dataXml)) {
            $dataXml = '<?xml version="1.0"?><data></data>';
        }

        $dataXml = CmsUtils::stripWhiteSpace($dataXml);
        return CmsUtils::escape($dataXml);
    }

    /**
     * @param $formXml
     * @return mixed|string
     */
    public function getFormSpec($formXml, $type = 'xml')
    {
        return CmsUtils::escape(CmsUtils::stripWhiteSpace($formXml));
    }

    public function getFormSpecFromFile ($formFile, $type = 'xml')
    {
        if (is_file($formFile)) {
            $formXml = file_get_contents($formFile);

            return $this->getFormSpec($formXml, $type);
        } else
            return 'Form file ('.$formFile.') not found';
    }

    public function getContent ($dataXml)
    {
        $content = new \SandboxDigital\Cms\CmsContent($dataXml);

        return $content;
    }

}
