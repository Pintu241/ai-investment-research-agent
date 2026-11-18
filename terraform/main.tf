
# Get the default VPC
data "aws_vpc" "default" {
  default = true
}

# Create a security group
resource "aws_security_group" "investment_sg" {
  name        = "investment-agent-sg"
  description = "Allow SSH and HTTP traffic"
  vpc_id      = data.aws_vpc.default.id

  # SSH access - restrict this to your public IP
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["152.59.118.126/32"]
  }

  # HTTP access
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Create EC2 instance
resource "aws_instance" "investment_server" {
  ami                    = "ami-0dc0718b8dd0dedd8"
  instance_type          = "t3.micro"
  key_name               = "investment-key"
  vpc_security_group_ids = [aws_security_group.investment_sg.id]

  tags = {
    Name = "Investment-Research-Agent"
  }
}
