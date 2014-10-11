<?php

class Renderer {
	private $_xmlData = null;
	private $_xslStyle = null;
	private $_pathTemplate = null;
	private $_pathData = null;
	
	
	public function __construct() {
		$this->_xmlData = new DOMDocument('1.0', 'utf-8');
		$this->_xslStyle = new DOMDocument('1.0', 'utf-8');
		$this->_pathTemplate = 'template';
		$this->_pathData = 'data';
	}
	
	/**
	 * Chargement du template
	 * @param string $template
	 */
	public function load($template) {
		$pathFile = APP_PATH . DIRECTORY_SEPARATOR . $this->_pathTemplate . DIRECTORY_SEPARATOR . $template . '.xsl';
		$this->_xslStyle->load($pathFile);
		
		$pathFile = APP_PATH . DIRECTORY_SEPARATOR . $this->_pathData . DIRECTORY_SEPARATOR . $template . '.xml';
		$this->_xmlData->load($pathFile);
	}
	
	/**
	 * Transformation XSL
	 * @return string
	 */
	public function show() {
		// chargement du moteur xsl
		$xslt = new XSLTProcessor();
		$xslt->importStyleSheet($this->_xslStyle);
		//DEBUG echo"<pre>";echo $this->_xmlData->saveXML();echo "</pre>";die('fuck');
		
		$html = $xslt->transformToXml($this->_xmlData);
		return $html;
	}
}