var java = require('java');
// java.classpath.push('jodconverter-2.2.2.jar');
java.classpath.push('./jodconverter-2.2.2');
//java.classpath.push("commons-io.jar");

var File = java.import('java.io.File');
var inputFile = new File('test.doc');
var outputFile = new File('out.docx');

java.import("java.util.ArrayList");

var SocketOpenOfficeConnection = java.newInstanceSync('SocketOpenOfficeConnection');
// var SocketOpenOfficeConnection = java.import('com.artofsolving.jodconverter.openoffice.connection.SocketOpenOfficeConnection');
// var connection = new SocketOpenOfficeConnection(8100);
// connection.connect();

// var OpenOfficeDocumentConverter = java.newInstanceSync('com.artofsolving.jodconverter.openoffice.converter.OpenOfficeDocumentConverter');
// var converter = new OpenOfficeDocumentConverter(connection);
// converter.convert(inputFile, outputFile);
// connection.disconnect();
