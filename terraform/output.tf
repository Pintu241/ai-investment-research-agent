

output "ec2_public_ip" {
  description = "Public IP of EC2 instance"
  value       = aws_instance.investment_server.public_ip
}

output "ec2_instance_id" {
  description = "EC2 instance ID"
  value       = aws_instance.investment_server.id
}
