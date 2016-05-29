import java.io.File;
import java.lang.System;
import com.artofsolving.jodconverter.openoffice.connection.SocketOpenOfficeConnection;
import com.artofsolving.jodconverter.openoffice.connection.OpenOfficeConnection;
import com.artofsolving.jodconverter.openoffice.converter.OpenOfficeDocumentConverter;
import com.artofsolving.jodconverter.DocumentConverter;

public class DocToDocx {
    public static void main(String[] args) {
        System.out.println("Starting..");
        File inputFile = new File("test.doc");
        File outputFile = new File("out.docx");

        try {

            OpenOfficeConnection connection = new SocketOpenOfficeConnection(8100);
            connection.connect();

            DocumentConverter converter = new OpenOfficeDocumentConverter(connection);
            converter.convert(inputFile, outputFile);

            connection.disconnect();
        } catch(Exception e) {
            System.out.println("Error: " + e);
        }
    }
}

