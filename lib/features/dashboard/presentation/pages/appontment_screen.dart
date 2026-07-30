import 'package:flutter/material.dart';

class AppointmentScreen extends StatelessWidget {
  const AppointmentScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Appointment Screen"),
      centerTitle: true,),
      
      body: Center(child: Text("This is appointment screen")),
    );
  }
}