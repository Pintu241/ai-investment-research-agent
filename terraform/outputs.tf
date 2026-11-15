output "instance_id" {
  value       = aws_instance.app_server.id
  description = "ID of the created EC2 instance"
}

output "public_ip" {
  value       = aws_instance.app_server.public_ip
  description = "Public IP address of the EC2 instance"
}

output "public_dns" {
  value       = aws_instance.app_server.public_dns
  description = "Public DNS of the EC2 instance"
}

output "ssh_command" {
  value       = "ssh -i path/to/${var.key_name}.pem ubuntu@${aws_instance.app_server.public_ip}"
  description = "Command to connect to the instance via SSH"
}

output "backend_api_url" {
  value       = "http://${aws_instance.app_server.public_ip}:5000"
  description = "Express Backend API endpoint"
}

output "frontend_ui_url" {
  value       = "http://${aws_instance.app_server.public_ip}:5173"
  description = "React Frontend Application endpoint"
}

