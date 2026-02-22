import 'package:http/http.dart' as http;
import 'dart:convert';

class GatewayService {
  final String gatewayUrl = 'http://localhost:3000';

  Future<Map<String, dynamic>> getSystemResources() async {
    final response = await http.get(Uri.parse('\$gatewayUrl/system/resources'));
    if (response.statusCode == 200) {
      return json.decode(response.body);
    }
    return {'cpu': 0, 'ram': 0, 'sessions': 0};
  }
}
