import 'package:flutter/material.dart';

class ResourceMonitorWidget extends StatelessWidget {
  const ResourceMonitorWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      color: Colors.black12,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: const [
          Column(
            children: [Text('CPU Usage'), Text('15%')],
          ),
          Column(
            children: [Text('RAM Usage'), Text('2.1 GB / 8.0 GB')],
          ),
          Column(
            children: [Text('Active Sessions'), Text('3 / 10')],
          ),
        ],
      ),
    );
  }
}
