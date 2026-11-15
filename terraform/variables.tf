variable "aws_region" {
  type        = string
  default     = "us-east-1"
  description = "AWS region for provisioning resources"
}

variable "instance_type" {
  type        = string
  default     = "t3.medium"
  description = "EC2 instance type"
}

variable "key_name" {
  type        = string
  description = "Name of the existing AWS Key Pair to attach to EC2"
}

variable "project_name" {
  type        = string
  default     = "ai-investment-research-agent"
  description = "Project name tag for all provisioned resources"
}

variable "environment" {
  type        = string
  default     = "production"
  description = "Deployment environment"
}

variable "allowed_ssh_cidr" {
  type        = list(string)
  default     = ["0.0.0.0/0"]
  description = "CIDR blocks allowed for SSH access"
}

