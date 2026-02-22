import 'package:flutter/material.dart';

class AgentCardWidget extends StatelessWidget {
  final String name;
  final String status;

  const AgentCardWidget({super.key, required this.name, required this.status});

  @override
  Widget build(BuildContext context) {
    final bool isRunning = status == 'Running';
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: Icon(
          Icons.smart_toy,
          color: isRunning ? Colors.green : Colors.grey,
        ),
        title: Text(name),
        subtitle: Text('Status: $status'),
        trailing: IconButton(
          icon: Icon(isRunning ? Icons.stop : Icons.play_arrow),
          onPressed: () {
            // Toggle start/stop
          },
        ),
      ),
    );
  }
}
