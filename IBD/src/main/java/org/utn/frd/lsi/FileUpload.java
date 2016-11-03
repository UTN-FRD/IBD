package org.utn.frd.lsi;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.StringReader;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.solr.client.solrj.SolrClient;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.impl.HttpSolrClient;
import org.apache.solr.client.solrj.response.UpdateResponse;
import org.apache.solr.common.SolrInputDocument;

import com.sun.jersey.core.header.FormDataContentDisposition;
import com.sun.jersey.multipart.FormDataParam;


import org.apache.tika.exception.TikaException;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.sax.BodyContentHandler;
import org.xml.sax.ContentHandler;
import org.xml.sax.SAXException;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.util.HashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.dataloader.DataLoader;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.DocumentBuilder;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.w3c.dom.Node;
import org.w3c.dom.Element;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

@Path("/files")
public class FileUpload {

	private static final String SERVER_UPLOAD_LOCATION_FOLDER = "/root/glassfish4/glassfish/domains/domain1/test/";

	@POST
	@Path("/upload")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public Response uploadFile(
			@FormDataParam("file") InputStream fileInputStream,
			@FormDataParam("file") FormDataContentDisposition contentDispositionHeader,
			@FormDataParam("idinvestigacion") String idinvestigacion,
			@FormDataParam("hash") String hash,
			@FormDataParam("formato") String formato) {

		String FileName=contentDispositionHeader.getFileName();
		String ConfigPath=SERVER_UPLOAD_LOCATION_FOLDER;
		String TempPath=SERVER_UPLOAD_LOCATION_FOLDER;
		String ProcStage=null;
		String Resource=null;
		String idarchivo=null;
		
		String res=null;
		
		long time_start, time_end_pre, time_end_dl, time_end;
		
		Date date = new Date();
		DateFormat hourdateFormat = new SimpleDateFormat("HH:mm:ss dd/MM/yyyy");
		
		time_start=System.currentTimeMillis();
	    Resource=idinvestigacion + "_" + hash;
	    ProcStage="O";		
		
		//Pregunto si existe en la base para la investigacion, si existe envio error.
		if(1==1) {
		  try {
		    //Cargo el xml si no existe envio error.

		    //Creo reguistro de archivo
		    idarchivo="1";
		  
		    //Paso a Resource idinvestigacion + "_" + hash y guardo stage

		  
		    //Guerdo el archivo como "O" + idinvestigacion + "_" + hash
		    SaveFile(fileInputStream, TempPath + ProcStage + Resource);

		    //Si va tika lo ejecuto
		    ProcStage=TikaProc(TempPath, ProcStage, Resource);
		  
		    //Si va PreRegex lo ejecuto ResourceLocation = PreRegex(ResourceLocation)
		    //ProcStage=PreRegex(TempPath, ProcStage, Resource);
		    time_end_pre=System.currentTimeMillis();
		    
		    //Ejecuto DataLoader
		    File fileorg = new File(TempPath + ProcStage + Resource);
		    File fXml = new File(ConfigPath	+ formato + ".xml");
		    HashMap<String, String> FixValues=new HashMap<String, String>();
		    FixValues.put("ID_Investigacion", idinvestigacion);
		    FixValues.put("ID_Archivo", idarchivo);
		    FixValues.put("Archivo_Origen", contentDispositionHeader.getFileName());
		    FixValues.put("Fecha_Proceso", hourdateFormat.format(date));
		    FixValues.put("Formato", formato);
		    
		    DataLoader dl = new DataLoader(fileorg, fXml, FixValues);
		    dl.LoadData();
		    time_end_dl=System.currentTimeMillis();
		  
		    //Si va DeNormalize lo ejecuto
		    
		    time_end = System.currentTimeMillis();
		    
		    //Guardo detalles del proceso en id de archivo
		    res="Read: " + dl.getReadCount() + " - Proc: " + dl.getProcCount() + " - Insert: " + dl.getInsertCount() + " time: " + ( time_end - time_start );
		    res=System.getProperty("user.dir");
		  } catch(IOException e) {
			  res="error IO " + e.getMessage();
		  } catch(SAXException e) {
			  res="error sax";
	      } catch(TikaException e) {
	    	  res="error tika";
	      } catch (Exception e) {
	    	  res="error dl " + e.getMessage();
	      }
		}
		
		return Response.status(200).entity(res).build();

	}

	
	private String TikaProc(String temppath, String procstage, String resource) throws IOException, SAXException, TikaException
	{
		InputStream input = new FileInputStream(new File(temppath+procstage+resource));
		ContentHandler handler = new BodyContentHandler(-1);
		Metadata metadata = new Metadata();
	    
		AutoDetectParser parser = new AutoDetectParser();
		parser.parse(input, handler, metadata);  
	    
		input.close();

		File file = new File(temppath + "T" + resource);

		if (!file.exists()) {
			file.createNewFile();
		}

		FileWriter fw = new FileWriter(file.getAbsoluteFile());
		BufferedWriter bw = new BufferedWriter(fw);
		bw.write(handler.toString());
		bw.close();	
		return "T";
	}

	
	private void SaveFile(InputStream uploadedInputStream, String resourceLocation) throws IOException
	{
		OutputStream outpuStream = new FileOutputStream(new File(resourceLocation));
		int read = 0;
		byte[] bytes = new byte[1024];

		outpuStream = new FileOutputStream(new File(resourceLocation));
		while ((read = uploadedInputStream.read(bytes)) != -1) {
			outpuStream.write(bytes, 0, read);
		}
		outpuStream.flush();
		outpuStream.close();
	}

//Regex
	private String PreRegex(String temppath, String procstage, String resource)
	{
		Pattern pattern = Pattern.compile("(\\d*\\.*(?:\\d|E)+)\\s+(\\d{1,2}/\\d{1,2}/\\d{2,4})\\s+(\\d{2}:\\d{2}:\\d{2})\\s+([A-Z])\\s+([0-9]+)\\s+(\\d+\\.\\d+)\\s+([^\\s]+)\\s+(.{5,30})\\s+(\\d+\\.\\d+)\\s+(\\b(?:[A-Z]|\\s){1,30}\\b)\\s+(\\b[^\\d]{1,15}\\b)", Pattern.DOTALL);
		Matcher matcher = pattern.matcher("content");
		String result = "";
		
		while(matcher.find()){
			for(int g = 1; g<=matcher.groupCount(); g++){
				result = result + (matcher.group(g)+"|");
			}
		}
		return "P";
	}


}